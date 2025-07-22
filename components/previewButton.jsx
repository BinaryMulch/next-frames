"use client";

import {useContext} from "react";
import {FaEye} from "react-icons/fa";

import {ImagesContext} from "@/app/context/imagesContext";

const PreviewButton = ({url}) => {
	const {handleImagePreview} = useContext(ImagesContext);

	return (

		<button onClick={
			() => handleImagePreview(url)
		} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors" title="Preview image">
			<FaEye />
		</button>

	);
};

export default PreviewButton;
