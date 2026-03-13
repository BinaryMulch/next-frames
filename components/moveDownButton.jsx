"use client";

import {useContext} from "react";
import {FaArrowDown} from "react-icons/fa";
import {toast} from "react-toastify";

import {ImagesContext} from "@/app/context/imagesContext";
import moveDownImage from "@/app/actions/moveDownImage";

const MoveDownButton = ({image}) => {
	const {queueMoveOperation, isReordering, isBlocked} = useContext(ImagesContext);

	const handleMoveClick = () => {
		try {
			queueMoveOperation(image, 'down', moveDownImage);
		} catch (error) {
			toast.error(error.message);
		}
	}

	return (

		<button
			onClick={handleMoveClick}
			disabled={isBlocked}
			className={`p-2 rounded-lg transition-all duration-150 active:scale-90 active:translate-y-0.5 ${
				isBlocked
					? 'text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed'
					: 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
			}`}
			title={isBlocked ? "Another user is managing images" : "Move image down"}
		>
			<FaArrowDown />
		</button>

	);
};

export default MoveDownButton;
