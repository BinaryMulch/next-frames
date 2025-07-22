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
			className={`mx-1 p-2 text-white rounded-lg shadow transition-colors ${
				isBlocked 
					? 'bg-gray-400 cursor-not-allowed' 
					: 'bg-primary-600 hover:bg-primary-700'
			}`}
			title={isBlocked ? "Another user is managing images" : "Move image up"}
		>
			<FaArrowUp />
		</button>

	);
};

export default MoveUpButton;
