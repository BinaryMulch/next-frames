"use server";

import {createClient} from "@/utils/supabase/server";
import getAllImages from "./getAllImages";
import { deleteFromStorage } from "./deleteImage";

export async function uploadImage(files) {
	const supabase = await createClient();

	// validate user session
	if (!validateUserSession(supabase)) return false;

	const uploadedStorageIds = []; // Track successful uploads for cleanup

	// upload images
	for (let i = 0; i < files.length; i ++) {
		const file = files[i];

		// generate storage id
		const storageId = crypto.randomUUID();

		// upload image to storage
		const storageSuccess = await uploadImageToStorage(supabase, storageId, file);
		if (!storageSuccess) {
			// Clean up previously uploaded files
			await cleanupStorageFiles(supabase, uploadedStorageIds);
			return false;
		}
		uploadedStorageIds.push(storageId);

		// get public url to image
		const publicUrl = await getPublicUrl(supabase, storageId);

		// add image to database
		const databaseSuccess = await insertImageToDatabase(supabase, file, publicUrl, storageId);
		if (!databaseSuccess) {
			// Clean up all uploaded files including current one
			await cleanupStorageFiles(supabase, uploadedStorageIds);
			return false;
		}

	};

	// successfully uploaded images
	return true;

}

async function cleanupStorageFiles(supabase, storageIds) {
	if (storageIds.length === 0) return;
	
	try {
		await supabase
			.storage
			.from("images")
			.remove(storageIds);
	} catch (error) {
		console.error("Cleanup Error: ", error);
		// Don't throw - this is cleanup, shouldn't affect main flow
	}
}

async function validateUserSession(supabase) {
	const {data, error} = await supabase.auth.getUser();

	if (error || !data.user) {
		console.error("Auth Error: ", error);
		return false;
	}

	return true;
}

async function uploadImageToStorage(supabase, storageId, file) {
	const {error} = await supabase
		.storage
		.from("images")
		.upload(storageId, file);

	if (error) {
		console.error("Storage Error: ", error);
		return false;
	}

	return true;
}

function getPublicUrl(supabase, storageId) {
	const {data: {publicUrl}} = supabase
		.storage
		.from("images")
		.getPublicUrl(storageId);

	return publicUrl;
}

async function insertImageToDatabase(supabase, file, publicUrl, storageId) {
	const images = await getAllImages(true, true); // requireAuth=true, includesPaused=true
	let next_position = 1
	if (images.length > 0) next_position = images[images.length - 1].order_position + 1

	const image = {
		name: file.name,
		url: publicUrl,
		storage_id: storageId,
		order_position: next_position
	}

	const {error} = await supabase
		.from("images")
		.insert(image);
	
	if (error) {
		console.error("Insert Error: ", error);
		return false;
	}

	return true;
}
