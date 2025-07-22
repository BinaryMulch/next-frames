"use server";

import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import getAllImages from "./getAllImages";

async function moveDownImage(image) {

	const supabase = await createClient();

	// validate user session
	const {data: authData, error: authError} = await supabase.auth.getUser();

	if (authError || !authData.user) {
		console.error("MoveDown Auth Error: ", authError);
		return false;
	}

	// Get fresh data from database to avoid optimistic update conflicts
	const {data: currentImageData, error: getCurrentError} = await supabase
		.from("images")
		.select()
		.eq("id", image.id)
		.single();

	if (getCurrentError || !currentImageData) {
		console.error("MoveDown - Failed to get current image:", getCurrentError);
		return false;
	}

	const currentPosition = currentImageData.order_position;

	// check if out of range
	const images = await getAllImages(true, true); // requireAuth=true, includesPaused=true
	if (currentPosition === images[images.length - 1].order_position) {
		console.log("MoveDown - Already at bottom position");
		return false;
	}

	// get the image below (higher order_position)
	const {data, error: getBelowError} = await supabase
		.from("images")
		.select()
		.eq("order_position", currentPosition + 1);
	if (getBelowError) {
		console.error("MoveDown - Failed to get below image:", getBelowError);
		return false;
	}

	const belowImage = data[0];
	if (!belowImage) {
		console.error("MoveDown - No image found below position:", currentPosition + 1);
		return false;
	}

	// swap order positions with rollback capability
	const belowPosition = belowImage.order_position;

	// update the image below to take current image's position
	const {error: updateBelowError} = await supabase
		.from("images")
		.update({order_position: currentPosition})
		.eq("id", belowImage.id);

	if (updateBelowError) {
		console.log("Move Down Error (first update): ", updateBelowError);
		return false;
	}

	// update current image to take the below image's position
	const {error: updateThisError} = await supabase
		.from("images")
		.update({order_position: belowPosition})
		.eq("id", image.id);
	
	if (updateThisError) {
		console.log("Move Down Error (second update): ", updateThisError);
		// Rollback the first update
		await supabase
			.from("images")
			.update({order_position: belowPosition})
			.eq("id", belowImage.id);
		return false;
	}

	// successfully moved image
	revalidatePath("/slideshow");
	return true;


}

export default moveDownImage;
