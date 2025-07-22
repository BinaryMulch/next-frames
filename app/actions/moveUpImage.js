"use server";

import {createClient} from "@/utils/supabase/server";
import getAllImages from "./getAllImages";

async function moveUpImage(image) {

	const supabase = await createClient();

	// validate user session
	const {data: authData, error: authError} = await supabase.auth.getUser();

	if (authError || !authData.user) {
		console.error("Auth Error: ", authError);
		return false;
	}

	// check if out of range
	const images = await getAllImages();
	if (image.order_position == images[0].order_position) return false;

	// get the image above (lower order_position)
	const {data, error: getAboveError} = await supabase
		.from("images")
		.select()
		.eq("order_position", image.order_position - 1);
	if (getAboveError) return false;

	const aboveImage = data[0];
	if (!aboveImage) return false; // No image found to swap with

	// swap order positions
	const currentPosition = image.order_position;
	const abovePosition = aboveImage.order_position;

	// update the image above to take current image's position
	const {error: updateAboveError} = await supabase
		.from("images")
		.update({order_position: currentPosition})
		.eq("id", aboveImage.id);

	// update current image to take the above image's position
	const {error: updateThisError} = await supabase
		.from("images")
		.update({order_position: abovePosition})
		.eq("id", image.id);
	
	if (updateAboveError || updateThisError) {
		console.log("Move Up Error: ", updateAboveError);
		console.log("Move Up Error: ", updateThisError);
		return false;
	}

	// successfully moved image
	return true;

}

export default moveUpImage;
