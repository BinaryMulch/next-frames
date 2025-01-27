"use client";

import {useContext, useState} from "react";
import {FaArrowDown} from "react-icons/fa";

import {ImagesContext} from "@/app/context/imagesContext";
import moveDownImage from "@/app/actions/moveDownImage";

const MoveDownButton = ({image}) => {
	const {handleImageUpdate} = useContext(ImagesContext);

	const [isLoading, setIsLoading] = useState(false);

	const handleMoveClick = async () => {
		setIsLoading(true);
		await moveDownImage(image);
		handleImageUpdate();
	}

	return (

		<button onClick={handleMoveClick} className="mx-1 p-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700">
			<FaArrowDown />
		</button>

	);
};

export default MoveDownButton;
