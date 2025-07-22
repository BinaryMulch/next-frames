"use client";

import {useContext} from "react";
import {FaPause, FaPlay} from "react-icons/fa";
import {toast} from "react-toastify";

import toggleImagePause from "@/app/actions/toggleImagePause";
import {ImagesContext} from "@/app/context/imagesContext";

const PauseButton = ({image}) => {
	const {toggleImagePauseOptimistic, isBlocked} = useContext(ImagesContext);

	const handlePauseToggle = () => {
		if (isBlocked) return;

		const action = image.is_paused ? "resumed" : "paused";
		
		try {
			toggleImagePauseOptimistic(image.id, () => toggleImagePause(image.id, image.is_paused));
			toast.success(`Image ${action} successfully!`);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const isPaused = image.is_paused;
	const buttonTitle = isPaused ? "Resume in slideshow" : "Pause from slideshow";

	return (
		<button 
			onClick={handlePauseToggle} 
			disabled={isBlocked}
			className={`p-2 rounded-lg transition-colors ${
				isBlocked
					? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
					: isPaused
						? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30'
						: 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/30'
			}`}
			title={isBlocked ? "Another user is managing images" : buttonTitle}
		>
			{isPaused ? <FaPlay /> : <FaPause />}
		</button>
	);
};

export default PauseButton;