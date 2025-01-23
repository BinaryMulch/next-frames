"use client";

import {FaCloudUploadAlt} from "react-icons/fa";
import {redirect} from "next/navigation";

import {uploadImage} from "@/app/actions/uploadImage";

const ImageUpload = () => {

	const handleDragOver = (event) => {
		event.preventDefault();
	}

	const handleDrop = (event) => {
		event.preventDefault();
		//console.log(event.dataTransfer.files);
		uploadImage(event.target.files);
	}

	const onImageUpload = (event) => {
		event.preventDefault();
		//console.log(event.target.files)
		
		const success = uploadImage(event.target.files);
		if (success) {
			//redirect("/dashboard");
			//onImageUploadSuccess(true);
		}
	}

	return (

		<div onDragOver={handleDragOver} onDrop={handleDrop}  className="flex items-center justify-center w-full p-4">
			<label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-primary-50">
				<div className="flex flex-col items-center justify-center py-5 pb-6">
					<FaCloudUploadAlt className="text-3xl mb-1" />
					<p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop.</p>
					<p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
				</div>
				<input onInput={onImageUpload} id="dropzone-file" name="dropzone-file" type="file" className="hidden" />
			</label>
		</div>

	);
};

export default ImageUpload;
