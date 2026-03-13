"use client";

import {useContext} from "react";
import {FaEye} from "react-icons/fa";

import {ImagesContext} from "@/app/context/imagesContext";

const PreviewButton = ({url}) => {
	const {handleImagePreview} = useContext(ImagesContext);

	return (

		<button onClick={
			() => handleImagePreview(url)
		} className="p-2 rounded-lg transition-all duration-150 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 active:scale-90" title="Preview image">
			<FaEye />
		</button>

	);
};

export default PreviewButton;
