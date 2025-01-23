"use server";

import {createClient} from "@/utils/supabase/server";

export async function getAllImages() {

	const supabase = await createClient();

	// validate user session
	const {data: authData, error: authError} = await supabase.auth.getUser();

	if (authError || !authData.user) {
		console.error("Auth Error: ", authError);
		return null;
	}

	// get all images
	const {data} = await supabase
		.from("images")
		.select()

	return data	

}
