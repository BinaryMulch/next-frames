"use server";

import {createClient} from "@/utils/supabase/server";

async function getAllImages(requireAuth = true, includesPaused = true) {

	const supabase = await createClient();

	// validate user session (optional)
	if (requireAuth) {
		const {data: authData, error: authError} = await supabase.auth.getUser();

		if (authError || !authData.user) {
			console.error("Auth Error: ", authError);
			return [];
		}
	}

	// get images with optional pause filtering
	let query = supabase.from("images").select();
	
	// For slideshow, exclude paused images
	if (!includesPaused) {
		query = query.eq("is_paused", false);
	}

	const {data, error} = await query;

	if (error) {
		console.error("Database Error: ", error);
		return [];
	}

	if (!data) {
		return [];
	}

	
	// sort images by order position
	data.sort(
		(a, b) => (a.order_position - b.order_position)
	)

	return data	

}

export default getAllImages;
