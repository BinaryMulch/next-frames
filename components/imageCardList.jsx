"use client";

import {useContext, useEffect, useState, memo} from "react";
import ClipLoader from "react-spinners/ClipLoader";

import {ImagesContext} from "@/app/context/imagesContext";
import ImageCard from "@/components/imageCard";

const ImageCardList = memo(() => {
	const {images, handleImageUpdate} = useContext(ImagesContext);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(
		() => {
			async function fetchImages() {
				await handleImageUpdate();
				setIsLoading(false);
			}
			fetchImages();
		},
		[]
	)

	return (

		<div className="flex-1 flex flex-col min-h-0">
			{!isLoading ? (
				images.length > 0 ? (
					<>
						<div className="flex items-center justify-between p-4 pb-2 flex-shrink-0">
							<h3 className="text-sm font-semibold text-gray-700">
								Images ({images.length})
							</h3>
						</div>
						<div className="flex-1 overflow-y-auto px-4 pb-4">
							<div className="flex flex-col gap-3">
								{
									images.map(
										(image) => (
											<ImageCard key={image.id} image={image} />
										)
									)
								}
							</div>
						</div>
					</>
				) : (
					<div className="flex-1 flex items-center justify-center p-4">
						<div className="text-center">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
								</svg>
							</div>
							<p className="text-gray-500 text-sm">No images uploaded yet</p>
							<p className="text-gray-400 text-xs mt-1">Upload your first image above</p>
						</div>
					</div>
				)
			) : (
				<div className="flex-1 flex justify-center items-center">
					<div className="text-center">
						<ClipLoader size={48} color="#6366f1"/>
						<p className="text-sm text-gray-600 mt-3">Loading images...</p>
					</div>
				</div>
			)}
		</div>

	);
});

ImageCardList.displayName = 'ImageCardList';

export default ImageCardList;
