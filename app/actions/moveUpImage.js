"use server";

import {createClient, getAuthUser} from "@/utils/pocketbase/server";
import {revalidatePath} from "next/cache";
import getAllImages from "./getAllImages";

async function moveUpImage(image) {
	const pb = await createClient();

	// validate user session
	const user = await getAuthUser();
	if (!user) {
		console.error("Auth Error: No authenticated user");
		return false;
	}

	// check if out of range
	const images = await getAllImages();
	if (image.order_position === images[0].order_position) return false;

	try {
		// find the image above (lower order_position)
		const aboveImages = await pb.collection('images').getFullList({
			filter: `order_position = ${image.order_position - 1}`,
		});
		
		if (aboveImages.length === 0) return false; // No image found to swap with
		const aboveImage = aboveImages[0];

		// swap order positions with rollback capability
		const currentPosition = image.order_position;
		const abovePosition = aboveImage.order_position;

		// update the image above to take current image's position
		await pb.collection('images').update(aboveImage.id, {
			order_position: currentPosition
		});

		try {
			// update current image to take the above image's position
			await pb.collection('images').update(image.id, {
				order_position: abovePosition
			});
		} catch (updateThisError) {
			console.log("Move Up Error (second update): ", updateThisError);
			// Rollback the first update
			try {
				await pb.collection('images').update(aboveImage.id, {
					order_position: abovePosition
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
		console.log("Move Up Error: ", error);
		return false;
	}
}

export default moveUpImage;
