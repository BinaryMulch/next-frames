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

		<div className="p-4 border-b border-gray-200">
			<div onDragOver={handleDragOver} onDrop={handleDrop} className="flex items-center justify-center w-full">
				<label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200">
					<div className="flex flex-col items-center justify-center py-3">

						{
							isLoading
							? (
								<div className="flex items-center">
									<ClipLoader size={16} color="#3b82f6"/>
									<p className="text-xs text-gray-600 ml-2 font-medium">Uploading...</p>
								</div>
							)
							: (
								<>
									<div className="flex items-center">
										<FaCloudUploadAlt className="text-blue-500 mr-2" />
										<span className="text-sm text-gray-700"><span className="font-semibold text-blue-600">Click to upload</span> or drag files</span>
									</div>
									<p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG, GIF (MAX. 5MB)</p>
								</>
							)
						}

					</div>
					<input onInput={onImageUpload} id="dropzone-file" name="dropzone-file" type="file" multiple accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml" className="hidden" />
				</label>
			</div>
		</div>

	);
};

export default ImageUpload;
