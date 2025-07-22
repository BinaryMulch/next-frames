"use client";

import PreviewButton from "./previewButton";
import MoveUpButton from "./moveUpButton";
import MoveDownButton from "./moveDownButton";
import DeleteButton from "./deleteButton";

const ImageCard = ({image}) => {

	return (

			<div className="flex items-center p-4 bg-white rounded-lg shadow xl:flex-row flex-col">
				<p className="flex flex-grow text-gray-700">{image.name}</p>
				<div className="pt-2">
					<PreviewButton image={image} />
					<MoveUpButton image={image} />
					<MoveDownButton image={image} />
					<DeleteButton id={image.id} />
				</div>

			</div>

	);
};

export default ImageCard;
