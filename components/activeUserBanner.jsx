"use client";

import {useContext} from "react";
import {ImagesContext} from "@/app/context/imagesContext";

const ActiveUserBanner = () => {
	const {isBlocked, activeUser, currentUser, claimActiveStatus} = useContext(ImagesContext);
	if (!isBlocked) return null;

	return (
		<div className="mb-6 p-4 bg-amber-50/80 dark:bg-amber-950/30 backdrop-blur border border-amber-200 dark:border-amber-800/30 rounded-2xl flex-shrink-0 shadow-sm">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<div className="relative w-3 h-3 mr-3">
						<div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-75"></div>
						<div className="relative w-3 h-3 bg-amber-500 rounded-full"></div>
					</div>
					<div>
						<p className="text-amber-900 dark:text-amber-200 font-semibold">Another user is managing images</p>
						<p className="text-amber-700 dark:text-amber-400 text-sm mt-1">Image management is temporarily locked to prevent conflicts</p>
					</div>
				</div>
				<button
					onClick={claimActiveStatus}
					className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl hover:brightness-110 hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-150 text-sm font-semibold"
				>
					Take Control
				</button>
			</div>
		</div>
	);
};

export default ActiveUserBanner;
