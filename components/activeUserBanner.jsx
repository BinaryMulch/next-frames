"use client";

import {useContext} from "react";
import {ImagesContext} from "@/app/context/imagesContext";

const ActiveUserBanner = () => {
	const {isBlocked, activeUser, currentUser, claimActiveStatus} = useContext(ImagesContext);
	if (!isBlocked) return null;

	return (
		<div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex-shrink-0 shadow-sm">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
					<div>
						<p className="text-yellow-900 font-semibold">Another user is managing images</p>
						<p className="text-yellow-700 text-sm mt-1">Image management is temporarily locked to prevent conflicts</p>
					</div>
				</div>
				<button
					onClick={claimActiveStatus}
					className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold shadow-sm"
				>
					Take Control
				</button>
			</div>
		</div>
	);
};

export default ActiveUserBanner;