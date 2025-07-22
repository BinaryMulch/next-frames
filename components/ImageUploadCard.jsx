"use client";

import {useContext, useState} from "react";
import {FaCloudUploadAlt} from "react-icons/fa";
import {toast} from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

import {uploadImage} from "@/app/actions/uploadImage";
import {ImagesContext} from "@/app/context/imagesContext";

const ImageUpload = () => {
	const {handleImageUpdate} = useContext(ImagesContext);

	const [isLoading, setIsLoading] = useState(false);

	const handleDragOver = (event) => {
		event.preventDefault();
	}

	const handleDrop = async (event) => {
		event.preventDefault();

		const files = event.dataTransfer.files;

		// Validate file types
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
		const invalidFiles = Array.from(files).filter(file => !validTypes.includes(file.type));

		if (invalidFiles.length > 0) {
			toast.error("Invalid file type! Only JPG, PNG, GIF, SVG allowed.");
			return false;
		}

		const MAX_FILE_SIZE = 5 * 1024 * 1024;
		const MAX_TOTAL_SIZE = 50 * 1024 * 1024;
		let totalSize = 0;
		for (let i = 0; i < files.length; i ++) {
			totalSize += files[i].size
			if (files[i].size > MAX_FILE_SIZE || totalSize > MAX_TOTAL_SIZE) {
				toast.error("Max file size exceeded!");
				return false;
			}
		}

		setIsLoading(true);
		const success = await uploadImage(files);
		handleImageUpdate();
		setIsLoading(false);
		if (success) {
			toast.success("File uploaded!");
		} else {
			toast.error("Upload failed!");
		}
	}

	const onImageUpload = async (event) => {
		event.preventDefault();

		const files = event.target.files;

		// Validate file types
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
		const invalidFiles = Array.from(files).filter(file => !validTypes.includes(file.type));

		if (invalidFiles.length > 0) {
			toast.error("Invalid file type! Only JPG, PNG, GIF, SVG allowed.");
			return false;
		}

		const MAX_FILE_SIZE = 5 * 1024 * 1024;
		for (let i = 0; i < files.length; i ++) {
			if (files[i].size > MAX_FILE_SIZE) {
				toast.error("Max file size exceeded!");
				return false;
			}
		}
		
		setIsLoading(true);
		const success = await uploadImage(files);
		handleImageUpdate();
		setIsLoading(false);
		if (success) {
			toast.success("File uploaded!");
		} else {
			toast.error("Upload failed!");
		}
	}

	return (

		<div onDragOver={handleDragOver} onDrop={handleDrop}  className="flex items-center justify-center w-full p-4">
			<label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-primary-50">
				<div className="flex flex-col items-center justify-center py-5 pb-6">

					{
						isLoading
						? (
							<div className="flex justify-center">
								<ClipLoader size={64} color="#6366f1"/>
							</div>
						)
						: (
							<>
								<FaCloudUploadAlt className="text-3xl mb-1" />
								<p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop.</p>
								<p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
							</>
						)
					}


				</div>
				<input onInput={onImageUpload} id="dropzone-file" name="dropzone-file" type="file" multiple accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml" className="hidden" />
			</label>
		</div>

	);
};

export default ImageUpload;
