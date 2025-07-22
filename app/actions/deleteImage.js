"use server";

import {createClient, getAuthUser} from "@/utils/pocketbase/server";
import { revalidatePath } from "next/cache";
import getAllImages from "./getAllImages";

export default async function deleteImage(id) {
	const pb = await createClient();

	// validate user session
	const user = await getAuthUser();
	if (!user) {
		console.error("Auth Error: No authenticated user");
		return false;
	}

	try {
		// delete image record (file will be auto-deleted by PocketBase)
		await pb.collection('images').delete(id);

		// compact order positions to remove gaps
		await compactOrderPositions(pb);

		// successfully delete image
		revalidatePath("/slideshow");
		return true;
	} catch (error) {
		console.error("Delete Error: ", error);
		return false;
	}
}

async function compactOrderPositions(pb) {
	try {
		// Get all remaining images in order
		const images = await getAllImages();
		
		// Update each image with a new sequential position
		for (let i = 0; i < images.length; i++) {
			const newPosition = i + 1;
			if (images[i].order_position !== newPosition) {
				await pb.collection('images').update(images[i].id, { 
					order_position: newPosition 
				});
			}
		}
	} catch (error) {
		console.error("Compact Order Positions Error: ", error);
		// Don't throw - this is cleanup, shouldn't affect main deletion
	}
}
