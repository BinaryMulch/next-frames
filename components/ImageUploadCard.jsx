"use client";

import {useContext, useState} from "react";
import {FaCloudUploadAlt} from "react-icons/fa";
import {toast} from "react-toastify";

import {uploadImage} from "@/app/actions/uploadImage";
import {ImagesContext} from "@/app/context/imagesContext";

const ImageUpload = () => {
	const {handleImageUpdate} = useContext(ImagesContext);

	const [isLoading, setIsLoading] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);

	const handleDragOver = (event) => {
		event.preventDefault();
		setIsDragOver(true);
	}

	const handleDragLeave = () => {
		setIsDragOver(false);
	}

	const handleDrop = async (event) => {
		event.preventDefault();
		setIsDragOver(false);

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
		const result = await uploadImage(files);
		handleImageUpdate();
		setIsLoading(false);
		if (result.success && result.failed === 0) {
			toast.success("File uploaded!");
		} else if (result.success && result.failed > 0) {
			toast.warn(`Uploaded ${result.uploaded} of ${result.uploaded + result.failed} files.`);
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
		const result = await uploadImage(files);
		handleImageUpdate();
		setIsLoading(false);
		if (result.success && result.failed === 0) {
			toast.success("File uploaded!");
		} else if (result.success && result.failed > 0) {
			toast.warn(`Uploaded ${result.uploaded} of ${result.uploaded + result.failed} files.`);
		} else {
			toast.error("Upload failed!");
		}
	}

	return (

		<div className="p-4 border-b border-gray-200 dark:border-gray-700/30">
			<div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="flex items-center justify-center w-full">
				<label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
					isDragOver
						? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-[1.02]'
						: 'border-gray-300 dark:border-gray-600/50 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:border-primary-400'
				}`}>
					<div className="flex flex-col items-center justify-center py-3">

						{
							isLoading
							? (
								<div className="flex items-center gap-3">
									<div className="w-5 h-5 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
									<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Uploading...</p>
								</div>
							)
							: (
								<>
									<div className="flex items-center">
										<FaCloudUploadAlt className="text-primary-500 mr-2 text-lg" />
										<span className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold text-primary-600 dark:text-primary-400">Click to upload</span> or drag files</span>
									</div>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">SVG, PNG, JPG, GIF (MAX. 5MB)</p>
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
