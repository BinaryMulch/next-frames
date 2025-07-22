"use server";

import {createClient, getAuthUser} from "@/utils/pocketbase/server";
import getAllImages from "./getAllImages";

export async function uploadImage(files) {
	const pb = await createClient();

	// validate user session
	const user = await getAuthUser();
	if (!user) {
		console.error("Auth Error: No authenticated user");
		return false;
	}

	const uploadedRecordIds = []; // Track successful uploads for cleanup

	// upload images
	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		try {
			// get next order position
			const images = await getAllImages();
			const nextPosition = images.length > 0 ? images[images.length - 1].order_position + 1 : 1;

			// create form data for upload
			const formData = new FormData();
			formData.append('name', file.name);
			formData.append('image', file);
			formData.append('order_position', nextPosition);

			// upload image and create record
			const record = await pb.collection('images').create(formData);
			uploadedRecordIds.push(record.id);

		} catch (error) {
			console.error("Upload Error: ", error);
			// Clean up previously uploaded records
			await cleanupUploadedRecords(pb, uploadedRecordIds);
			return false;
		}
	}

	// successfully uploaded images
	return true;
}

async function cleanupUploadedRecords(pb, recordIds) {
	if (recordIds.length === 0) return;
	
	try {
		for (const recordId of recordIds) {
			await pb.collection('images').delete(recordId);
		}
	} catch (error) {
		console.error("Cleanup Error: ", error);
		// Don't throw - this is cleanup, shouldn't affect main flow
	}
}
