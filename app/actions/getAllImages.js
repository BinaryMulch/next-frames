"use server";

import {createClient, getAuthUser} from "@/utils/pocketbase/server";

async function getAllImages(requireAuth = true) {
	const pb = await createClient();

	// validate user session (optional)
	if (requireAuth) {
		const user = await getAuthUser();
		if (!user) {
			console.error("Auth Error: No authenticated user");
			return [];
		}
	}

	try {
		// get all images
		const records = await pb.collection('images').getFullList({
			sort: '+order_position',
		});

		return records;
	} catch (error) {
		console.error("Database Error: ", error);
		return [];
	}
}

export default getAllImages;
