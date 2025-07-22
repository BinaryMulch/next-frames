"use client";

import {useContext, useState} from "react";
import {FaArrowDown} from "react-icons/fa";

import {ImagesContext} from "@/app/context/imagesContext";
import moveDownImage from "@/app/actions/moveDownImage";

const MoveDownButton = ({image}) => {
	const {handleImageUpdate, isReordering, setIsReordering} = useContext(ImagesContext);

	const [isLoading, setIsLoading] = useState(false);

	const handleMoveClick = async () => {
		if (isReordering) return; // Prevent simultaneous operations
		
		setIsLoading(true);
		setIsReordering(true);
		await moveDownImage(image);
		handleImageUpdate();
		setIsLoading(false);
		setIsReordering(false);
	}

	return (

		<button 
			onClick={handleMoveClick} 
			disabled={isReordering || isLoading}
			className={`mx-1 p-2 text-white rounded-lg shadow ${
				isReordering || isLoading 
					? 'bg-gray-400 cursor-not-allowed' 
					: 'bg-primary-600 hover:bg-primary-700'
			}`}
		>
			<FaArrowDown />
		</button>

	);
};

export default MoveDownButton;
