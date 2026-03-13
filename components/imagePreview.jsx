"use client";

import {useContext, useState, useEffect} from "react";
import Image from "next/image";

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

		<div className="relative h-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700/30"
			style={{
				backgroundImage: `
					linear-gradient(45deg, rgba(0,0,0,0.03) 25%, transparent 25%),
					linear-gradient(-45deg, rgba(0,0,0,0.03) 25%, transparent 25%),
					linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.03) 75%),
					linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.03) 75%)
				`,
				backgroundSize: '20px 20px',
				backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
			}}
		>
			{
				isLoading
				&& (
					<div className="absolute inset-0 flex justify-center items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
						<div className="w-full h-full skeleton"></div>
					</div>
				)
			}

			{!imagePreviewUrl && !isLoading && (
				<div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
					<div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
						<svg className="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
							<path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">Image Preview</h3>
					<p className="text-gray-500 dark:text-gray-500 text-sm max-w-sm">
						Select an image from the list to preview it here
					</p>
				</div>
			)}

			{imagePreviewUrl && (
				<Image
					className="object-contain transition-opacity duration-500"
					src={imagePreviewUrl}
					fill
					alt="Image preview"
					onLoad={handleLoad}
					onError={handleLoad}
					style={{opacity: isLoading ? 0 : 1}}
				/>
			)}
		</div>

	);
};

export default PreviewImage;
