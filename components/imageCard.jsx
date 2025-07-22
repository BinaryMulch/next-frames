"use client";

import {memo} from "react";
import PreviewButton from "./previewButton";
import MoveUpButton from "./moveUpButton";
import MoveDownButton from "./moveDownButton";
import DeleteButton from "./deleteButton";

const ImageCard = memo(({image}) => {

	return (

			<div className="group flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 xl:flex-row flex-col gap-3">
				<div className="flex-grow min-w-0">
					<p className="text-gray-800 font-medium truncate" title={image.name}>
						{image.name}
					</p>
					<p className="text-xs text-gray-500 mt-1">
						Image • Position {image.position}
					</p>
				</div>
				<div className="flex gap-1 shrink-0">
					<PreviewButton url={image.url} />
					<MoveUpButton image={image} />
					<MoveDownButton image={image} />
					<DeleteButton id={image.id} storageId={image.storage_id} />
				</div>

			</div>

	);
});

ImageCard.displayName = 'ImageCard';

export default ImageCard;
