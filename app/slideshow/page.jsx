"use client";

import {useState, useEffect} from "react";
import getAllImages from "../actions/getAllImages";
import Carousel from "@/components/carousel";

const SlideshowPage = () => {
	const [images, setImages] = useState();

	async function fetchImages() {
		try {
			const imageData = await getAllImages(false); // Public access for slideshow
			setImages(
				imageData.map((image) => {
					if (image.image) {
						return `${process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'}/api/files/${image.collectionId}/${image.id}/${image.image}`;
					}
					return '';
				}).filter(url => url !== '')
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
