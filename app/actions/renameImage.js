"use server";

import { createClient } from "@/utils/pocketbase/server";

async function renameImage(imageId, newName) {
	const pb = await createClient();

	if (!pb.authStore.isValid) {
		console.error("Auth Error: not authenticated");
		return false;
	}

	try {
		await pb.collection("images").update(imageId, {
			name: newName,
		});
	} catch (error) {
		console.error("Rename image error: ", error);
		return false;
	}

	return true;
}

export default renameImage;
