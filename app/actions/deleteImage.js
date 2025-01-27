"use server";

import {createClient} from "@/utils/supabase/server";

export default async function deleteImage(id, storageId) {

	const supabase = await createClient();

	// validate user session
	const {data: authData, error: authError} = await supabase.auth.getUser();

	if (authError || !authData.user) {
		console.error("Auth Error: ", authError);
		return false;
	}

	// delete image from storage
	const storageSuccess = await deleteFromStorage(supabase, storageId);
	if (!storageSuccess) return false;
	/*
	const {error: storageError} = await supabase
		.storage
		.from("images")
		.remove([storageId]);
	
	if (storageError) {
		console.error("Storage Error: ", storageError);
		return false;
	}
	*/

	// delete image from database
	const databaseSuccess = await deleteFromDatabase(supabase, id);
	if (!databaseSuccess) return false;
	/*
	const {error: databaseError} = await supabase
		.from("images")
		.delete()
		.eq("id", id);
	
	if (databaseError) {
		console.error("Database Error: ", databaseError);
		return false;
	}
	*/

	// successfully delete image
	return true;

}

export async function deleteFromStorage(supabase, storageId) {

	const {error} = await supabase
		.storage
		.from("images")
		.remove([storageId]);
	
	if (error) {
		console.error("Storage Error: ", error);
		return false;
	}

	return true;

}

export async function deleteFromDatabase(supabase, id) {

	const {error} = await supabase
		.from("images")
		.delete()
		.eq("id", id);

	if (error) {
		console.error("Database Error: ", error);
		return false;
	}

	return true;

}
