"use client";

import {useState, useEffect} from "react";
import getAllImages from "../actions/getAllImages";
import Carousel from "@/components/carousel";

const SlideshowPage = () => {
	const [images, setImages] = useState();

	async function fetchImages() {
		try {
			const imageData = await getAllImages();
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

	/*
	const imageData = await getAllImages();

	const images = imageData.map(
		(image) => (image.url)
	)
	*/

	return (

		<>
			{
				!images || images.length == 0
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
