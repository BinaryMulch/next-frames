"use server";

import { createClient } from "@/utils/pocketbase/server";

async function getAllImages(requireAuth = true, includesPaused = true) {

	const pb = await createClient();

	// validate user session (optional)
	if (requireAuth) {
		if (!pb.authStore.isValid) {
			console.error("Auth Error: not authenticated");
			return [];
		}
	}

	// get images with optional pause filtering
	try {
		const options = {
			sort: "order_position",
		};

		if (!includesPaused) {
			options.filter = "is_paused = false";
		}

		const records = await pb.collection("images").getFullList(options);

		// Map records to include computed url
		return records.map(record => ({
			id: record.id,
			name: record.name,
			url: pb.files.getURL(record, record.file),
			order_position: record.order_position,
			is_paused: record.is_paused,
		}));

	} catch (error) {
		console.error("Database Error: ", error);
		return [];
	}
}

export default getAllImages;
