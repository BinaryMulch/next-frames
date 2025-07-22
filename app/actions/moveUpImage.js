"use server";

import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import getAllImages from "./getAllImages";

async function moveUpImage(image) {

	const supabase = await createClient();

	// validate user session
	const {data: authData, error: authError} = await supabase.auth.getUser();

	if (authError || !authData.user) {
		console.error("MoveUp Auth Error: ", authError);
		return false;
	}

	// Get fresh data from database to avoid optimistic update conflicts
	const {data: currentImageData, error: getCurrentError} = await supabase
		.from("images")
		.select()
		.eq("id", image.id)
		.single();

	if (getCurrentError || !currentImageData) {
		console.error("MoveUp - Failed to get current image:", getCurrentError);
		return false;
	}

	const currentPosition = currentImageData.order_position;

	// check if out of range
	const images = await getAllImages(true, true); // requireAuth=true, includesPaused=true
	if (currentPosition === images[0].order_position) {
		console.log("MoveUp - Already at top position");
		return false;
	}

	// get the image above (lower order_position)
	const {data, error: getAboveError} = await supabase
		.from("images")
		.select()
		.eq("order_position", currentPosition - 1);
	if (getAboveError) {
		console.error("MoveUp - Failed to get above image:", getAboveError);
		return false;
	}

	const aboveImage = data[0];
	if (!aboveImage) {
		console.error("MoveUp - No image found above position:", currentPosition - 1);
		return false;
	}

	// swap order positions with rollback capability
	const abovePosition = aboveImage.order_position;

	// update the image above to take current image's position
	const {error: updateAboveError} = await supabase
		.from("images")
		.update({order_position: currentPosition})
		.eq("id", aboveImage.id);

	if (updateAboveError) {
		console.log("Move Up Error (first update): ", updateAboveError);
		return false;
	}

	// update current image to take the above image's position
	const {error: updateThisError} = await supabase
		.from("images")
		.update({order_position: abovePosition})
		.eq("id", image.id);
	
	if (updateThisError) {
		console.log("Move Up Error (second update): ", updateThisError);
		// Rollback the first update
		await supabase
			.from("images")
			.update({order_position: abovePosition})
			.eq("id", aboveImage.id);
		return false;
	}

	// successfully moved image
	revalidatePath("/slideshow");
	return true;

}

export default moveUpImage;
