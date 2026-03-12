"use server";

import { createClient } from "@/utils/pocketbase/server";
import { revalidatePath } from "next/cache";
import getAllImages from "./getAllImages";

async function moveUpImage(image) {

	const pb = await createClient();

	// validate user session
	if (!pb.authStore.isValid) {
		console.error("MoveUp Auth Error: not authenticated");
		return false;
	}

	// Get fresh data from database
	let currentImageData;
	try {
		currentImageData = await pb.collection("images").getOne(image.id);
	} catch (error) {
		console.error("MoveUp - Failed to get current image:", error);
		return false;
	}

	const currentPosition = currentImageData.order_position;

	// check if out of range
	const images = await getAllImages(true, true);
	if (currentPosition === images[0].order_position) {
		console.log("MoveUp - Already at top position");
		return false;
	}

	// get the image above (next lower order_position)
	let aboveImages;
	try {
		aboveImages = await pb.collection("images").getFullList({
			filter: `order_position < ${currentPosition}`,
			sort: "-order_position",
			limit: 1,
		});
	} catch (error) {
		console.error("MoveUp - Failed to get above image:", error);
		return false;
	}

	const aboveImage = aboveImages[0];
	if (!aboveImage) {
		console.error("MoveUp - No image found above position:", currentPosition - 1);
		return false;
	}

	// swap order positions
	const abovePosition = aboveImage.order_position;

	try {
		await pb.collection("images").update(aboveImage.id, {
			order_position: currentPosition,
		});
	} catch (error) {
		console.log("Move Up Error (first update): ", error);
		return false;
	}

	try {
		await pb.collection("images").update(image.id, {
			order_position: abovePosition,
		});
	} catch (error) {
		console.log("Move Up Error (second update): ", error);
		// Rollback the first update
		try {
			await pb.collection("images").update(aboveImage.id, {
				order_position: abovePosition,
			});
		} catch (rollbackError) {
			console.error("Move Up Rollback Error: ", rollbackError);
		}
		return false;
	}

	revalidatePath("/slideshow");
	revalidatePath("/dashboard");
	return true;

}

export default moveUpImage;
