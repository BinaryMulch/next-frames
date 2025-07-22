"use client";

import {memo} from "react";
import PreviewButton from "./previewButton";
import MoveUpButton from "./moveUpButton";
import MoveDownButton from "./moveDownButton";
import DeleteButton from "./deleteButton";

const ImageCard = memo(({image}) => {

	return (

			<div className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
				<div className="flex-grow min-w-0 mr-4">
					<p className="text-gray-900 font-medium text-sm truncate" title={image.name}>
						{image.name}
					</p>
					<p className="text-xs text-gray-500 mt-1">
						Position {image.order_position} • {image.name.split('.').pop().toUpperCase()}
					</p>
				</div>
				<div className="flex items-center bg-gray-50 rounded-lg p-1 shrink-0">
					<PreviewButton url={image.url} />
					<div className="mx-1 w-px h-6 bg-gray-300"></div>
					<div className="flex">
						<MoveUpButton image={image} />
						<MoveDownButton image={image} />
					</div>
					<div className="mx-1 w-px h-6 bg-gray-300"></div>
					<DeleteButton id={image.id} storageId={image.storage_id} />
				</div>

			</div>

	);
});

ImageCard.displayName = 'ImageCard';

export default ImageCard;
