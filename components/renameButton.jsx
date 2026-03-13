"use client";

import {useContext} from "react";
import {FaPen} from "react-icons/fa";

import {ImagesContext} from "@/app/context/imagesContext";

const RenameButton = ({onStartEditing}) => {
	const {isBlocked} = useContext(ImagesContext);

	return (
		<button
			onClick={() => { if (!isBlocked) onStartEditing(); }}
			disabled={isBlocked}
			className={`p-2 rounded-lg transition-all duration-150 active:scale-90 ${
				isBlocked
					? 'text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed'
					: 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
			}`}
			title={isBlocked ? "Another user is managing images" : "Rename"}
		>
			<FaPen />
		</button>
	);
};

export default RenameButton;
