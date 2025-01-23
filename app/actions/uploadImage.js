"use server";

import {createClient} from "@/utils/supabase/server";

export async function uploadImage(files) {
	const supabase = await createClient();

	// validate user session
	if (!validateUserSession(supabase)) return;

	// generate storage id
	const storageId = crypto.randomUUID();

	// upload image to storage
	if (!uploadImageToStorage(supabase, storageId, files[0])) return;

	// get public url to image
	const publicUrl = getPublicUrl(supabase, storageId);

	// add image to database
	if (!insertImageToDatabase(supabase, files[0], publicUrl, storageId)) return;

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
	const {count} = await supabase
		.from("images")
		.select("*", {count: "exact", head: true});

	const image = {
		name: file.name,
		url: publicUrl,
		storage_id: storageId,
		order_position: count + 1
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
