"use client";

import {useContext, useState, useEffect} from "react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";

import {ImagesContext} from "@/app/context/imagesContext";

const PreviewImage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [previousUrl, setPreviousUrl] = useState("");

	const {imagePreviewUrl} = useContext(ImagesContext);

	useEffect(
		() => {
			if (imagePreviewUrl && imagePreviewUrl !== previousUrl) {
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

		<div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200">
			{
				isLoading
				&& (
					<div className="absolute inset-0 flex justify-center items-center bg-white/80 backdrop-blur-sm z-10">
						<div className="text-center">
							<ClipLoader size={48} color="#6366f1"/>
							<p className="text-sm text-gray-600 mt-3">Loading preview...</p>
						</div>
					</div>
				)
			}

			{!imagePreviewUrl && !isLoading && (
				<div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
					<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
						<svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-gray-700 mb-2">Image Preview</h3>
					<p className="text-gray-500 text-sm max-w-sm">
						Select an image from the list to see a preview here
					</p>
				</div>
			)}

			{imagePreviewUrl && (
				<Image
					className="object-contain transition-opacity duration-300"
					src={imagePreviewUrl}
					fill
					alt="Image preview"
					onLoad={handleLoad}
					onError={handleLoad}
					style={{visibility: isLoading ? "hidden" : "visible"}}
				/>
			)}
		</div>

	);
};

export default PreviewImage;
