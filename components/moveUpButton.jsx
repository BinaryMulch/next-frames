"use client";

import {useContext, useState} from "react";
import {FaArrowUp} from "react-icons/fa";
import {toast} from "react-toastify";

import {ImagesContext} from "@/app/context/imagesContext";
import moveUpImage from "@/app/actions/moveUpImage";

const MoveUpButton = ({image}) => {
	const {queueMoveOperation, isReordering, isBlocked} = useContext(ImagesContext);

	const handleMoveClick = () => {
		try {
			queueMoveOperation(image, 'up', moveUpImage);
		} catch (error) {
			toast.error(error.message);
		}
	}

	return (

		<button 
			onClick={handleMoveClick} 
			disabled={isBlocked}
			className={`p-2 rounded-lg transition-colors ${
				isBlocked 
					? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
					: 'text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
			}`}
			title={isBlocked ? "Another user is managing images" : "Move image up"}
		>
			<FaArrowUp />
		</button>

	);
};

export default MoveUpButton;
