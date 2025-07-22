"use client";

import {memo} from "react";
import PreviewButton from "./previewButton";
import MoveUpButton from "./moveUpButton";
import MoveDownButton from "./moveDownButton";
import DeleteButton from "./deleteButton";
import PauseButton from "./pauseButton";

const ImageCard = memo(({image}) => {

	return (

			<div className={`group flex items-center justify-between p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
			image.is_paused 
				? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700'
				: 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-400'
		}`}>
				<div className="flex-grow min-w-0 mr-4">
					<div className="flex items-center gap-2">
						<p className={`font-medium text-sm truncate ${
							image.is_paused
								? 'text-orange-800 dark:text-orange-200'
								: 'text-gray-900 dark:text-white'
						}`} title={image.name}>
							{image.name}
						</p>
						{image.is_paused && (
							<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
								Paused
							</span>
						)}
					</div>
					<p className={`text-xs mt-1 ${
						image.is_paused
							? 'text-orange-600 dark:text-orange-400'
							: 'text-gray-500 dark:text-gray-400'
					}`}>
						Position {image.order_position} • {image.name.split('.').pop().toUpperCase()}
						{image.is_paused && ' • Hidden from slideshow'}
					</p>
				</div>
				<div className={`flex items-center rounded-lg p-1 shrink-0 ${
					image.is_paused
						? 'bg-orange-100 dark:bg-orange-800/30'
						: 'bg-gray-50 dark:bg-gray-600'
				}`}>
					<PreviewButton url={image.url} />
					<div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-500"></div>
					<PauseButton image={image} />
					<div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-500"></div>
					<div className="flex">
						<MoveUpButton image={image} />
						<MoveDownButton image={image} />
					</div>
					<div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-500"></div>
					<DeleteButton id={image.id} storageId={image.storage_id} />
				</div>

			</div>

	);
});

ImageCard.displayName = 'ImageCard';

export default ImageCard;
