"use client";

import {useContext, useState} from "react";
import {FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

import deleteImage from "@/app/actions/deleteImage";
import {ImagesContext} from "@/app/context/imagesContext";

const DeleteButton = ({id, storageId}) => {
	const {handleImageUpdate, isReordering} = useContext(ImagesContext);

	const [isLoading, setIsLoading] = useState(false);

	const handleDeleteClick = async () => {
		setIsLoading(true);
		const success = await deleteImage(id, storageId);
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
			className={`p-2 rounded-lg transition-colors ${
				isReordering || isLoading 
					? 'text-gray-400 cursor-not-allowed' 
					: 'text-red-600 hover:text-red-700 hover:bg-red-50'
			}`}
			title="Delete image"
		>
			{
				isLoading
				? <ClipLoader size={16} color="#9ca3af"/>
				: <FaTrash />
			}
		</button>

	);
};

export default DeleteButton;
