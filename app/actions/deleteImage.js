"use server";

import { createClient } from "@/utils/pocketbase/server";
import { revalidatePath } from "next/cache";
import getAllImages from "./getAllImages";

export default async function deleteImage(id) {

	const pb = await createClient();

	// validate user session
	if (!pb.authStore.isValid) {
		console.error("Auth Error: not authenticated");
		return false;
	}

	// delete image record (PocketBase auto-deletes attached files)
	try {
		await pb.collection("images").delete(id);
	} catch (error) {
		console.error("Delete Error: ", error);
		return false;
	}

	// compact order positions to remove gaps
	await compactOrderPositions(pb);

	// successfully deleted image
	revalidatePath("/slideshow");
	revalidatePath("/dashboard");
	return true;

}

async function compactOrderPositions(pb) {
	try {
		// Get all remaining images in order
		const images = await getAllImages(true, true);

		// Update each image with a new sequential position
		for (let i = 0; i < images.length; i++) {
			const newPosition = i + 1;
			if (images[i].order_position !== newPosition) {
				await pb.collection("images").update(images[i].id, {
					order_position: newPosition,
				});
			}
		}
	} catch (error) {
		console.error("Compact Order Positions Error: ", error);
	}
}
