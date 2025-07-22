"use server";

import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";

async function toggleImagePause(imageId, currentPauseState) {
	const supabase = await createClient();

	// Validate user session
	const {data: authData, error: authError} = await supabase.auth.getUser();
	
	if (authError || !authData.user) {
		console.error("Auth Error: ", authError);
		return false;
	}

	// Toggle the pause state
	const newPauseState = !currentPauseState;
	
	const {error: updateError} = await supabase
		.from("images")
		.update({is_paused: newPauseState})
		.eq("id", imageId);

	if (updateError) {
		console.error("Toggle pause error: ", updateError);
		return false;
	}

	// Revalidate paths to update slideshow
	revalidatePath("/slideshow");
	return true;
}

export default toggleImagePause;