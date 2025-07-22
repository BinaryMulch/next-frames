"use client";

import {useContext} from "react";
import {FaEye} from "react-icons/fa";

import {ImagesContext} from "@/app/context/imagesContext";

const PreviewButton = ({image}) => {
	const {handleImagePreview} = useContext(ImagesContext);

	const getImageUrl = (image) => {
		if (image.image) {
			return `${process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'}/api/files/${image.collectionId}/${image.id}/${image.image}`;
		}
		return '';
	};

	return (

		<button onClick={
			() => handleImagePreview(getImageUrl(image))
		} className="mx-1 p-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700">
			<FaEye />
		</button>

	);
};

export default PreviewButton;
