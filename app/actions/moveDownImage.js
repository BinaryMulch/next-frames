"use server";

import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import getAllImages from "./getAllImages";

async function moveDownImage(image) {

	const supabase = await createClient();

	// validate user session
	const {data: authData, error: authError} = await supabase.auth.getUser();

	if (authError || !authData.user) {
		console.error("Auth Error: ", authError);
		return false;
	}

	// check if out of range
	const images = await getAllImages();
	if (image.order_position === images[images.length - 1].order_position) return false;

	// get the image below (higher order_position)
	const {data, error: getBelowError} = await supabase
		.from("images")
		.select()
		.eq("order_position", image.order_position + 1);
	if (getBelowError) return false;

	const belowImage = data[0];
	if (!belowImage) return false; // No image found to swap with

	// swap order positions with rollback capability
	const currentPosition = image.order_position;
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
