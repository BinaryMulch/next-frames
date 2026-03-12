"use server";

import { createClient } from "@/utils/pocketbase/server";
import getAllImages from "./getAllImages";

export async function uploadImage(files) {
	const pb = await createClient();

	// validate user session
	if (!pb.authStore.isValid) {
		console.error("Auth Error: not authenticated");
		return false;
	}

	const createdRecordIds = []; // Track successful creates for cleanup

	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		try {
			// Get next position
			const images = await getAllImages(true, true);
			let next_position = 1;
			if (images.length > 0) next_position = images[images.length - 1].order_position + 1;

			// Create record with file attached
			const record = await pb.collection("images").create({
				name: file.name,
				file: file,
				order_position: next_position,
				is_paused: false,
			});

			createdRecordIds.push(record.id);

		} catch (error) {
			console.error("Upload Error: ", error);
			// Clean up previously created records
			for (const id of createdRecordIds) {
				try {
					await pb.collection("images").delete(id);
				} catch (cleanupError) {
					console.error("Cleanup Error: ", cleanupError);
				}
			}
			return false;
		}
	}

	return true;
}
