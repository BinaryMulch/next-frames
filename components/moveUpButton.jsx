"use client";

import {useContext, useState} from "react";
import {FaArrowUp} from "react-icons/fa";

import {ImagesContext} from "@/app/context/imagesContext";
import moveUpImage from "@/app/actions/moveUpImage";

const MoveUpButton = ({image}) => {
	const {handleImageUpdate} = useContext(ImagesContext);

	const [isLoading, setIsLoading] = useState(false);

	const handleMoveClick = async () => {
		setIsLoading(true);
		await moveUpImage(image);
		handleImageUpdate();
	}

	return (

		<button onClick={handleMoveClick} className="mx-1 p-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700">
			<FaArrowUp />
		</button>

	);
};

export default MoveUpButton;
