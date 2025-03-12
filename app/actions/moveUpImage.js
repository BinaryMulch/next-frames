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

	// get below image
	const {data, error: getBelowError} = await supabase
		.from("images")
		.select()
		.eq("order_position", image.order_position + 1);
	if (getBelowError) return false;

	const belowImage = data[0];
	console.log(data)

	// update below image
	const {error: updateBelowError} = await supabase
		.from("images")
		.update({order_position: image.order_position})
		.eq("id", belowImage.id);

	// update this image
	const {error: updateThisError} = await supabase
		.from("images")
		.update({order_position: image.order_position + 1})
		.eq("id", image.id);
	
	if (updateBelowError || updateThisError) {
		console.log("Move Up Error: ", updateBelowError);
		console.log("Move Up Error: ", updateThisError);
		return false;
	}

	// successfully moved image
	return true;

}

export default moveUpImage;
