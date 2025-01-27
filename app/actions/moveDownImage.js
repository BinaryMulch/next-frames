"use server";

import {createClient} from "@/utils/supabase/server";
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
	if (image.order_position == images.length) return false;

	// get above image
	const {data, error: getAboveError} = await supabase
		.from("images")
		.select()
		.eq("order_position", image.order_position - 1);
	if (getAboveError) return false;

	const aboveImage = data[0];

	// update above image
	const {error: updateAboveError} = await supabase
		.from("images")
		.update({order_position: image.order_position})
		.eq("id", aboveImage.id);

	// update this image
	const {error: updateThisError} = await supabase
		.from("images")
		.update({order_position: image.order_position - 1})
		.eq("id", image.id);
	
	if (updateAboveError || updateThisError) {
		console.log("Move Up Error: ", updateAboveError);
		console.log("Move Up Error: ", updateThisError);
		return false;
	}

	// successfully moved image
	return true;


}

export default moveDownImage;
