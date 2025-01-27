"use client";

import {FaArrowUp, FaArrowDown} from "react-icons/fa";

import PreviewButton from "./previewButton";
import DeleteButton from "./deleteButton";

const ImageCard = ({image}) => {

	return (

			<div className="flex items-center p-4 bg-white rounded-lg shadow xl:flex-row flex-col">
				<p className="flex flex-grow text-gray-700">{image.name}</p>
				<div className="pt-2">
					<PreviewButton url={image.url} />
					<button className="mx-1 p-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700">
						<FaArrowUp />
					</button>
					<button className="mx-1 p-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700">
						<FaArrowDown />
					</button>
					<DeleteButton id={image.id} storageId={image.storage_id} />
				</div>

			</div>

	);
};

export default ImageCard;
