"use server";

import { createClient } from "@/utils/pocketbase/server";
import { revalidatePath } from "next/cache";

async function toggleImagePause(imageId, currentPauseState) {
	const pb = await createClient();

	// Validate user session
	if (!pb.authStore.isValid) {
		console.error("Auth Error: not authenticated");
		return false;
	}

	// Toggle the pause state
	const newPauseState = !currentPauseState;

	try {
		await pb.collection("images").update(imageId, {
			is_paused: newPauseState,
		});
	} catch (error) {
		console.error("Toggle pause error: ", error);
		return false;
	}

	revalidatePath("/slideshow");
	revalidatePath("/dashboard");
	return true;
}

export default toggleImagePause;
