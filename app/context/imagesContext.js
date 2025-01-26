"use client";

import {createContext, useContext, useState} from "react";

export const ImagesContext = createContext();

export const ImagesProvider = ({children}) => {

	const [images, setImages] = useState([]);
	const [imagePreviewUrl, setImagePreviewUrl] = useState("");
	
	const handleImagePreview = (url) => {
		setImagePreviewUrl("");
		setImagePreviewUrl(url);
	}

	return (

		<ImagesContext.Provider value={{imagePreviewUrl, handleImagePreview}}>
			{children}
		</ImagesContext.Provider>

	)

}
