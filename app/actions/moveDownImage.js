"use server";

import { createClient } from "@/utils/pocketbase/server";

import getAllImages from "./getAllImages";

async function moveDownImage(image) {

	const pb = await createClient();

	// validate user session
	if (!pb.authStore.isValid) {
		console.error("MoveDown Auth Error: not authenticated");
		return false;
	}

	// Get fresh data from database
	let currentImageData;
	try {
		currentImageData = await pb.collection("images").getOne(image.id);
	} catch (error) {
		console.error("MoveDown - Failed to get current image:", error);
		return false;
	}

	const currentPosition = currentImageData.order_position;

	// check if out of range
	const images = await getAllImages(true, true);
	if (currentPosition === images[images.length - 1].order_position) {
		console.log("MoveDown - Already at bottom position");
		return false;
	}

	// get the image below (next higher order_position)
	let belowImages;
	try {
		belowImages = await pb.collection("images").getFullList({
			filter: `order_position > ${currentPosition}`,
			sort: "order_position",
			limit: 1,
		});
	} catch (error) {
		console.error("MoveDown - Failed to get below image:", error);
		return false;
	}

	const belowImage = belowImages[0];
	if (!belowImage) {
		console.error("MoveDown - No image found below position:", currentPosition + 1);
		return false;
	}

	// swap order positions
	const belowPosition = belowImage.order_position;

	try {
		await pb.collection("images").update(belowImage.id, {
			order_position: currentPosition,
		});
	} catch (error) {
		console.log("Move Down Error (first update): ", error);
		return false;
	}

	try {
		await pb.collection("images").update(image.id, {
			order_position: belowPosition,
		});
	} catch (error) {
		console.log("Move Down Error (second update): ", error);
		// Rollback the first update
		try {
			await pb.collection("images").update(belowImage.id, {
				order_position: belowPosition,
			});
		} catch (rollbackError) {
			console.error("Move Down Rollback Error: ", rollbackError);
		}
		return false;
	}

	return true;

}

export default moveDownImage;
