"use client";

import {useContext, useEffect, useState, memo} from "react";

import {ImagesContext} from "@/app/context/imagesContext";
import ImageCard from "@/components/imageCard";

const SkeletonCard = () => (
	<div className="flex items-center justify-between p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50">
		<div className="flex-grow min-w-0 mr-4">
			<div className="skeleton h-4 w-32 mb-2"></div>
			<div className="skeleton h-3 w-24"></div>
		</div>
		<div className="flex items-center gap-1">
			<div className="skeleton h-8 w-8 rounded-lg"></div>
			<div className="skeleton h-8 w-8 rounded-lg"></div>
			<div className="skeleton h-8 w-8 rounded-lg"></div>
		</div>
	</div>
);

const ImageCardList = memo(() => {
	const {images, handleImageUpdate} = useContext(ImagesContext);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(
		() => {
			async function fetchImages() {
				try {
					await handleImageUpdate();
				} catch (error) {
					console.error("Error fetching images:", error);
				} finally {
					setIsLoading(false);
				}
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
						<div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Images
							</h3>
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
								{images.length}
							</span>
						</div>
						<div className="flex-1 overflow-y-auto px-6 pb-6">
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
							<div className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
								</svg>
							</div>
							<p className="text-gray-700 dark:text-gray-300 font-medium">No images yet</p>
							<p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Upload your first image to get started</p>
						</div>
					</div>
				)
			) : (
				<div className="flex-1 flex flex-col p-6 gap-3">
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
				</div>
			)}
		</div>

	);
});

ImageCardList.displayName = 'ImageCardList';

export default ImageCardList;
