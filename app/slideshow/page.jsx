"use client";

import {useState, useEffect} from "react";
import getAllImages from "../actions/getAllImages";
import Carousel from "@/components/carousel";

const SlideshowPage = () => {
	const [images, setImages] = useState();

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
			{
				!images || images.length === 0
				? (
					<></>
				)
				: (
					<Carousel images={images}/>
				)
			}
		</>

	);
};

export default SlideshowPage;
