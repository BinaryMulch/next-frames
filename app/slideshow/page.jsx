"use client";

import {useState, useEffect} from "react";
import getAllImages from "../actions/getAllImages";
import Carousel from "@/components/carousel";

const SlideshowPage = () => {
	const [images, setImages] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	async function fetchImages() {
		try {
			const imageData = await getAllImages(false, false); // Public access, exclude paused images
			setImages(
				imageData.map(
					(image) => (image.url)
				)
			);
			console.log("Images fetched successfully")
		}
		catch (error) {
			console.error("Error fetching images: ", error);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(
		() => {
			fetchImages();

			const intervalId = setInterval(fetchImages, 300_000);
			return () => clearInterval(intervalId);
		}, []
	);

	return (

		<>
			{isLoading ? (
				<div className="h-screen w-screen flex items-center justify-center bg-black">
					<div className="text-center animate-pulse">
						<p className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">Next Frames</p>
						<p className="text-gray-500 text-sm mt-2">Loading slideshow...</p>
					</div>
				</div>
			) : !images || images.length === 0 ? (
				<div className="h-screen w-screen flex items-center justify-center bg-black">
					<div className="text-center">
						<svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
						</svg>
						<p className="text-gray-400 text-lg">No images to display</p>
						<p className="text-gray-600 text-sm mt-1">Upload images from the dashboard</p>
					</div>
				</div>
			) : (
				<Carousel images={images}/>
			)}
		</>

	);
};

export default SlideshowPage;
