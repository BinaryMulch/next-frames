"use server";

import {createClient} from "@/utils/supabase/server";

async function deleteImage(id, storageId) {

	const supabase = await createClient();

	// validate user session
	const {data: authData, error: authError} = await supabase.auth.getUser();

	if (authError || !authData.user) {
		console.error("Auth Error: ", authError);
		return false;
	}

	// delete image from storage
	const {error: storageError} = await supabase
		.storage
		.from("images")
		.remove([storageId]);
	
	if (storageError) {
		console.error("Storage Error: ", storageError);
		return false;
	}

	// delete image from database
	const {error: databaseError} = await supabase
		.from("images")
		.delete()
		.eq("id", id);
	
	if (databaseError) {
		console.error("Database Error: ", databaseError);
		return false;
	}

	// successfully delete image
	return true;

}

export default deleteImage;
