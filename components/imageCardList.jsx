"use client";

import {useContext, useEffect, useState} from "react";
import ClipLoader from "react-spinners/ClipLoader";

import {ImagesContext} from "@/app/context/imagesContext";
import ImageCard from "@/components/imageCard";

const imageCardList = () => {
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

		!isLoading
		? (
			<div className="flex flex-col gap-2 p-4 max-h-[72vh] overflow-y-auto">
				{
					images.map(
						(image) => (
							<ImageCard key={image.id} image={image} />
						)
					)
				}
			</div>
		)
		: (
			
			<div className="flex justify-center pt-16">
				<ClipLoader size={96} color="#6366f1"/>
			</div>
			
		)

	);
};

export default imageCardList;
