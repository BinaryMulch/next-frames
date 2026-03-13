"use client";

import {useContext, useState} from "react";
import {FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";

import deleteImage from "@/app/actions/deleteImage";
import {ImagesContext} from "@/app/context/imagesContext";

const DeleteButton = ({id}) => {
	const {handleImageUpdate, isReordering} = useContext(ImagesContext);

	const [isLoading, setIsLoading] = useState(false);

	const handleDeleteClick = async () => {
		setIsLoading(true);
		const success = await deleteImage(id);
		if (!success) {
			toast.error("File could not be deleted!");
			setIsLoading(false);
			return;
		}
		handleImageUpdate();
		setIsLoading(false);
		toast.success("File deleted!");
	}

	return (

		<button
			onClick={handleDeleteClick}
			disabled={isReordering || isLoading}
			className={`p-2 rounded-lg transition-all duration-150 active:scale-90 ${
				isReordering || isLoading
					? 'text-gray-400 dark:text-gray-600 opacity-40 cursor-not-allowed'
					: 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'
			}`}
			title="Delete image"
		>
			{
				isLoading
				? <div className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>
				: <FaTrash />
			}
		</button>

	);
};

export default DeleteButton;
