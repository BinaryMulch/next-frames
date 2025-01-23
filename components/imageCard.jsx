"use client";

import {FaTrashAlt, FaArrowUp, FaArrowDown, FaEye} from "react-icons/fa";

const ImageCard = () => {

	const previewClick = () => {
		console.log("shift up click");
	}

	const shiftUpClick = () => {
		console.log("shift up click");
	}

	const shiftDownClick = () => {
		console.log("shift down click");
	}

	const deleteClick = () => {
		console.log("shift delete click");
	}

	return (

			<div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow">
				<p className="flex flex-grow font-normal text-gray-700">Image name here.png</p>
				<button onClick={previewClick} className="mx-1 p-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700">
					<FaEye />
				</button>
				<button onClick={shiftUpClick} className="mx-1 p-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700">
					<FaArrowUp />
				</button>
				<button onClick={shiftDownClick} className="mx-1 p-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700">
					<FaArrowDown />
				</button>
				<button onClick={deleteClick} className="ml-4 mx-1 p-2 bg-red-600 text-white shadow rounded-lg hover:bg-red-700">
					<FaTrashAlt />
				</button>
			</div>

	);
};

export default ImageCard;
