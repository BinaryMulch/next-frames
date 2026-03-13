"use client";

import {memo} from "react";
import PreviewButton from "./previewButton";
import MoveUpButton from "./moveUpButton";
import MoveDownButton from "./moveDownButton";
import DeleteButton from "./deleteButton";
import PauseButton from "./pauseButton";

const ImageCard = memo(({image}) => {

	return (

			<div className={`group flex items-center justify-between p-4 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-[transform,box-shadow] duration-200 border border-gray-200/50 dark:border-gray-700/30 ${
			image.is_paused
				? 'pl-[calc(1rem-3px)] border-l-4 border-l-orange-400 bg-gray-50/80 dark:bg-gray-800/50'
				: 'bg-white/80 dark:bg-gray-800/60 hover:border-primary-200 dark:hover:border-primary-500/30'
		}`}>
				<div className="flex-grow min-w-0 mr-4">
					<p className={`font-medium text-sm break-words ${
						image.is_paused
							? 'text-gray-600 dark:text-gray-300'
							: 'text-gray-900 dark:text-white'
					}`} title={image.name}>
						{image.name}
					</p>
					<p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
						Position {image.order_position} • {image.name.split('.').pop().toUpperCase()}
						{image.is_paused && ' • Hidden from slideshow'}
						{image.is_paused && (
							<span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
								Paused
							</span>
						)}
					</p>
				</div>
				<div className="flex items-center rounded-lg p-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 bg-gray-50/80 dark:bg-gray-700/50">
					<PreviewButton url={image.url} />
					<div className="mx-1 w-px h-6 bg-gray-300/50 dark:bg-gray-500/50"></div>
					<PauseButton image={image} />
					<div className="mx-1 w-px h-6 bg-gray-300/50 dark:bg-gray-500/50"></div>
					<div className="flex">
						<MoveUpButton image={image} />
						<MoveDownButton image={image} />
					</div>
					<div className="mx-1 w-px h-6 bg-gray-300/50 dark:bg-gray-500/50"></div>
					<DeleteButton id={image.id} />
				</div>

			</div>

	);
});

ImageCard.displayName = 'ImageCard';

export default ImageCard;
