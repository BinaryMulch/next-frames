"use client";

import {useContext, useState, useEffect} from "react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";

import {ImagesContext} from "@/app/context/imagesContext";

const PreviewImage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [previousUrl, setPreviousUrl] = useState("");

	const {imagePreviewUrl} = useContext(ImagesContext);

	useEffect(
		() => {
			if (imagePreviewUrl != previousUrl) {
				setIsLoading(true);
			}
		},
		[imagePreviewUrl, previousUrl]
	)

	const handleLoad = () => {
		setIsLoading(false);
		setPreviousUrl(imagePreviewUrl);
	}

	return (

		<>
			{
				isLoading
				&& (
					<div className="flex justify-center items-center h-full">
						<ClipLoader size={96} color="#6366f1"/>
					</div>
				)
			}

			<p style={{visibility: isLoading || imagePreviewUrl ? "hidden" : "visible"}} className="flex justify-center items-center h-full text-lg text-gray-700">Image Preview</p>
			<Image
				className="object-contain"
				src={imagePreviewUrl ? imagePreviewUrl : "/placeholder_1920x1080.png"}
				fill
				alt=""
				onLoad={handleLoad}
				onError={handleLoad}
				style={{visibility: isLoading || !imagePreviewUrl ? "hidden" : "visible"}}
			/>
			
		</>

	);
};

export default PreviewImage;
