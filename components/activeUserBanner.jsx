"use client";

import {useContext, useEffect, useState} from "react";
import {ImagesContext} from "@/app/context/imagesContext";

const ActiveUserBanner = () => {
	const {isBlocked, activeUser, currentUser, claimActiveStatus} = useContext(ImagesContext);
	const [debugInfo, setDebugInfo] = useState(null);

	useEffect(() => {
		// Debug: Check localStorage every second
		const debugInterval = setInterval(() => {
			const stored = localStorage.getItem('activeUser');
			if (stored) {
				const { userId, timestamp } = JSON.parse(stored);
				const now = Date.now();
				const age = Math.floor((now - timestamp) / 1000);
				setDebugInfo({ userId, age, currentUser, isBlocked });
			} else {
				setDebugInfo({ userId: 'none', age: 0, currentUser, isBlocked });
			}
		}, 1000);

		return () => clearInterval(debugInterval);
	}, [currentUser, isBlocked]);

	// Always show debug info in development
	const showDebug = false; // Set to true to enable debug panel

	if (!isBlocked && !showDebug) return null;

	return (
		<>
			{isBlocked && (
				<div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex-shrink-0">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<div className="w-3 h-3 bg-amber-500 rounded-full mr-3 animate-pulse"></div>
							<div>
								<p className="text-amber-800 font-medium">Another user is managing images</p>
								<p className="text-amber-600 text-sm">Image management is temporarily locked to prevent conflicts</p>
							</div>
						</div>
						<button
							onClick={claimActiveStatus}
							className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
						>
							Take Control
						</button>
					</div>
				</div>
			)}

			{showDebug && debugInfo && (
				<div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg flex-shrink-0 text-xs font-mono">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<strong>Current User:</strong> {currentUser ? currentUser.substring(0, 8) + '...' : 'None'}
						</div>
						<div>
							<strong>Active User:</strong> {debugInfo.userId === 'none' ? 'None' : debugInfo.userId.substring(0, 8) + '...'}
						</div>
						<div>
							<strong>Age:</strong> {debugInfo.age}s (timeout: 15s)
						</div>
						<div>
							<strong>Status:</strong> {isBlocked ? 'BLOCKED' : 'ACTIVE'}
						</div>
					</div>
					<button 
						onClick={() => localStorage.removeItem('activeUser')} 
						className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
					>
						Clear localStorage
					</button>
				</div>
			)}
		</>
	);
};

export default ActiveUserBanner;