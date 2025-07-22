"use server";

import {createClient} from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import getAllImages from "./getAllImages";

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

	// delete image from database
	const databaseSuccess = await deleteFromDatabase(supabase, id);
	if (!databaseSuccess) return false;

	// compact order positions to remove gaps
	await compactOrderPositions(supabase);

	// successfully delete image
	revalidatePath("/slideshow");
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

async function compactOrderPositions(supabase) {
	try {
		// Get all remaining images in order
		const images = await getAllImages(true, true); // requireAuth=true, includesPaused=true
		
		// Update each image with a new sequential position
		for (let i = 0; i < images.length; i++) {
			const newPosition = i + 1;
			if (images[i].order_position !== newPosition) {
				await supabase
					.from("images")
					.update({ order_position: newPosition })
					.eq("id", images[i].id);
			}
		}
	} catch (error) {
		console.error("Compact Order Positions Error: ", error);
		// Don't throw - this is cleanup, shouldn't affect main deletion
	}
}
