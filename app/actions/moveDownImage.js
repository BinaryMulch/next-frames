"use server";

import {createClient, getAuthUser} from "@/utils/pocketbase/server";
import {revalidatePath} from "next/cache";
import getAllImages from "./getAllImages";

async function moveDownImage(image) {
	const pb = await createClient();

	// validate user session
	const user = await getAuthUser();
	if (!user) {
		console.error("Auth Error: No authenticated user");
		return false;
	}

	// check if out of range
	const images = await getAllImages();
	if (image.order_position === images[images.length - 1].order_position) return false;

	try {
		// find the image below (higher order_position)
		const belowImages = await pb.collection('images').getFullList({
			filter: `order_position = ${image.order_position + 1}`,
		});
		
		if (belowImages.length === 0) return false; // No image found to swap with
		const belowImage = belowImages[0];

		// swap order positions with rollback capability
		const currentPosition = image.order_position;
		const belowPosition = belowImage.order_position;

		// update the image below to take current image's position
		await pb.collection('images').update(belowImage.id, {
			order_position: currentPosition
		});

		try {
			// update current image to take the below image's position
			await pb.collection('images').update(image.id, {
				order_position: belowPosition
			});
		} catch (updateThisError) {
			console.log("Move Down Error (second update): ", updateThisError);
			// Rollback the first update
			try {
				await pb.collection('images').update(belowImage.id, {
					order_position: belowPosition
				});
			} catch (rollbackError) {
				console.error("Rollback Error: ", rollbackError);
			}
			return false;
		}

		// successfully moved image
		revalidatePath("/slideshow");
		return true;
	} catch (error) {
		console.log("Move Down Error: ", error);
		return false;
	}
}

export default moveDownImage;
