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

	// Get next position once before the loop
	const existingImages = await getAllImages(true, true);
	let next_position = 1;
	if (existingImages.length > 0) next_position = existingImages[existingImages.length - 1].order_position + 1;

	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		try {

			// Create record with file attached
			const record = await pb.collection("images").create({
				name: file.name,
				file: file,
				order_position: next_position + i,
				is_paused: false,
			});

			createdRecordIds.push(record.id);

		} catch (error) {
			console.error(`Upload Error for file ${file.name}: `, error);
			// Stop uploading remaining files but keep successfully uploaded ones
			return {
				success: createdRecordIds.length > 0,
				uploaded: createdRecordIds.length,
				failed: files.length - createdRecordIds.length,
			};
		}
	}

	return { success: true, uploaded: createdRecordIds.length, failed: 0 };
}
