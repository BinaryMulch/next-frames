"use server";

import {createClient} from "@/utils/supabase/server";
import getAllImages from "./getAllImages";
import { deleteFromStorage } from "./deleteImage";

export async function uploadImage(files) {
	const supabase = await createClient();

	// validate user session
	if (!validateUserSession(supabase)) return false;

	// upload images
	for (let i = 0; i < files.length; i ++) {
		const file = files[i];

		// generate storage id
		const storageId = crypto.randomUUID();

		// upload image to storage
		const storageSuccess = await uploadImageToStorage(supabase, storageId, file);
		if (!storageSuccess) return false;

		// get public url to image
		const publicUrl = await getPublicUrl(supabase, storageId);

		// add image to database
		const databaseSuccess = await insertImageToDatabase(supabase, file, publicUrl, storageId);
		if (!databaseSuccess) {
			deleteFromStorage(supabase, file.storageId);
			return false;
		}

	};

	// successfully uploaded images
	return true;

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
		console.error("Storage Error: ", storageError);
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
	const images = await getAllImages();
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
