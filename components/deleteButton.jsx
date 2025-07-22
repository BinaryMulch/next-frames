"use client";

import {useContext, useState} from "react";
import {FaTrashAlt} from "react-icons/fa";
import {toast} from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

import deleteImage from "@/app/actions/deleteImage";
import {ImagesContext} from "@/app/context/imagesContext";

const DeleteButton = ({id}) => {
	const {handleImageUpdate} = useContext(ImagesContext);

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

		<button onClick={handleDeleteClick} className="ml-2 mx-1 p-2 bg-red-600 text-white shadow rounded-lg hover:bg-red-700">
			{
				isLoading
				? (
					<div className="flex justify-center items-center">
						<ClipLoader size={16} color="#ffffff"/>
					</div>
					
				)
				: (
					<FaTrashAlt />
				)
			}
			
		</button>

	);
};

export default DeleteButton;
