"use client";

import {createContext, useContext, useState} from "react";

import getAllImages from "@/app/actions/getAllImages";

export const ImagesContext = createContext();

export const ImagesProvider = ({children}) => {

	const [images, setImages] = useState([]);
	const [imagePreviewUrl, setImagePreviewUrl] = useState("");
	const [isReordering, setIsReordering] = useState(false);
	
	const handleImageUpdate = async () => {
		try {
			const data = await getAllImages();
			setImages(data || []);
		} catch (error) {
			console.error("Error updating images: ", error);
			setImages([]);
		}
	}

	const handleImagePreview = (url) => {
		setImagePreviewUrl(url);
	}

	return (

		<ImagesContext.Provider value={{images, handleImageUpdate, imagePreviewUrl, handleImagePreview, isReordering, setIsReordering}}>
			{children}
		</ImagesContext.Provider>

	)

}
