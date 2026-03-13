"use client";

import {memo, useState, useRef, useContext, useEffect} from "react";
import {ImagesContext} from "@/app/context/imagesContext";
import renameImage from "@/app/actions/renameImage";
import PreviewButton from "./previewButton";
import MoveUpButton from "./moveUpButton";
import MoveDownButton from "./moveDownButton";
import DeleteButton from "./deleteButton";
import PauseButton from "./pauseButton";
import RenameButton from "./renameButton";

const ImageCard = memo(({image}) => {
	const {renameImageOptimistic} = useContext(ImagesContext);
	const [isEditing, setIsEditing] = useState(false);

	const lastDotIndex = image.name.lastIndexOf('.');
	const baseName = lastDotIndex > 0 ? image.name.slice(0, lastDotIndex) : image.name;
	const extension = lastDotIndex > 0 ? image.name.slice(lastDotIndex) : '';

	const [editName, setEditName] = useState(baseName);
	const inputRef = useRef(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	const handleSave = () => {
		const trimmed = editName.trim();
		if (!trimmed || trimmed === baseName) {
			setEditName(baseName);
			setIsEditing(false);
			return;
		}
		const newFullName = trimmed + extension;
		renameImageOptimistic(image.id, newFullName, () => renameImage(image.id, newFullName));
		setIsEditing(false);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSave();
		} else if (e.key === 'Escape') {
			setEditName(baseName);
			setIsEditing(false);
		}
	};

	return (

			<div className={`group flex items-center justify-between p-4 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-[transform,box-shadow] duration-200 border border-gray-200 dark:border-gray-700/30 ${
			image.is_paused
				? 'pl-[calc(1rem-3px)] border-l-4 border-l-orange-400 bg-gray-50 dark:bg-gray-800/50'
				: 'bg-white dark:bg-gray-800/60 hover:border-primary-300 dark:hover:border-primary-500/30'
		}`}>
				<div className="flex-grow min-w-0 mr-4">
					{isEditing ? (
						<input
							ref={inputRef}
							type="text"
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							onBlur={handleSave}
							onKeyDown={handleKeyDown}
							className="font-medium text-sm w-full px-2 py-1 rounded border border-primary-300 dark:border-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50"
						/>
					) : (
						<p className={`font-medium text-sm break-words ${
							image.is_paused
								? 'text-gray-600 dark:text-gray-300'
								: 'text-gray-900 dark:text-white'
						}`}>
							{image.name}
						</p>
					)}
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
				<div className="flex items-center rounded-lg p-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 bg-gray-100 dark:bg-gray-700/50">
					<PreviewButton url={image.url} />
					<div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-500/50"></div>
					<RenameButton onStartEditing={() => { setEditName(baseName); setIsEditing(true); }} />
					<div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-500/50"></div>
					<PauseButton image={image} />
					<div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-500/50"></div>
					<div className="flex">
						<MoveUpButton image={image} />
						<MoveDownButton image={image} />
					</div>
					<div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-500/50"></div>
					<DeleteButton id={image.id} />
				</div>

			</div>

	);
});

ImageCard.displayName = 'ImageCard';

export default ImageCard;
