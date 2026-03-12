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
					<p className="text-gray-400 text-lg">Loading slideshow...</p>
				</div>
			) : !images || images.length === 0 ? (
				<div className="h-screen w-screen flex items-center justify-center bg-black">
					<p className="text-gray-400 text-lg">No images to display</p>
				</div>
			) : (
				<Carousel images={images}/>
			)}
		</>

	);
};

export default SlideshowPage;
