"use client";

import {useContext} from "react";
import {FaEye} from "react-icons/fa";

import {ImagesContext} from "@/app/context/imagesContext";

const PreviewButton = ({url}) => {
	const {handleImagePreview} = useContext(ImagesContext);

	return (

		<button onClick={
			() => handleImagePreview(url)
		} className="mx-1 p-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700">
			<FaEye />
		</button>

	)
}

export default PreviewButton;
