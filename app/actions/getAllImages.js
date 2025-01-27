"use server";

import {createClient} from "@/utils/supabase/server";

async function getAllImages() {

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
		.select();

	
	// sort images by order position
	data.sort(
		(a, b) => (a.order_position - b.order_position)
	)

	return data	

}

export default getAllImages;
