"use client";

import {createContext, useContext, useState, useRef, useEffect, useMemo, useCallback} from "react";
import {createClient} from "@/utils/supabase/client";

import getAllImages from "@/app/actions/getAllImages";

export const ImagesContext = createContext();

export const ImagesProvider = ({children}) => {

	const [images, setImages] = useState([]);
	const [imagePreviewUrl, setImagePreviewUrl] = useState("");
	const [isReordering, setIsReordering] = useState(false);
	const [activeUser, setActiveUser] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const [isBlocked, setIsBlocked] = useState(false);
	const operationQueue = useRef([]);
	const isProcessingQueue = useRef(false);
	const heartbeatInterval = useRef(null);
	const HEARTBEAT_INTERVAL = 5000; // 5 seconds
	const ACTIVE_USER_TIMEOUT = 15000; // 15 seconds
	
	const handleImageUpdate = useCallback(async () => {
		try {
			const data = await getAllImages();
			setImages(data || []);
		} catch (error) {
			console.error("Error updating images: ", error);
			setImages([]);
		}
	}, []);

	const handleImagePreview = useCallback((url) => {
		setImagePreviewUrl(url);
	}, []);

	// Initialize current user and set up heartbeat
	useEffect(() => {
		let mounted = true;
		let checkInterval;
		
		const initializeUser = async () => {
			const supabase = createClient();
			const { data: { user } } = await supabase.auth.getUser();
			if (user && mounted) {
				setCurrentUser(user.id);
				startHeartbeat(user.id);
				
				// Periodically check for active user changes (reduced frequency)
				checkInterval = setInterval(checkForActiveUser, 10000);
			}
		};
		
		initializeUser();
		
		return () => {
			mounted = false;
			if (heartbeatInterval.current) {
				clearInterval(heartbeatInterval.current);
			}
			if (checkInterval) {
				clearInterval(checkInterval);
			}
		};
	}, []);

	const startHeartbeat = (userId) => {
		// Clear existing heartbeat
		if (heartbeatInterval.current) {
			clearInterval(heartbeatInterval.current);
		}

		// Set up heartbeat to maintain active status
		heartbeatInterval.current = setInterval(() => {
			updateActiveUser(userId);
		}, HEARTBEAT_INTERVAL);

		// Initial heartbeat
		updateActiveUser(userId);
	};

	const updateActiveUser = useCallback((userId) => {
		const now = Date.now();
		const activeUserData = {
			userId,
			timestamp: now
		};
		localStorage.setItem('activeUser', JSON.stringify(activeUserData));
		checkForActiveUser();
	}, []);

	const checkForActiveUser = useCallback(() => {
		const stored = localStorage.getItem('activeUser');
		if (!stored) {
			setActiveUser(null);
			setIsBlocked(false);
			return;
		}

		const { userId, timestamp } = JSON.parse(stored);
		const now = Date.now();
		
		// If the stored user's heartbeat is too old, consider them inactive
		if (now - timestamp > ACTIVE_USER_TIMEOUT) {
			localStorage.removeItem('activeUser');
			setActiveUser(null);
			setIsBlocked(false);
			return;
		}

		// Set active user
		setActiveUser(userId);
		
		// Only block if it's a DIFFERENT user who is active
		setIsBlocked(currentUser && userId !== currentUser);
	}, [currentUser]);

	const claimActiveStatus = useCallback(() => {
		if (currentUser) {
			updateActiveUser(currentUser);
			startHeartbeat(currentUser);
		}
	}, [currentUser, updateActiveUser]);

	const processOperationQueue = async () => {
		if (isProcessingQueue.current || operationQueue.current.length === 0) {
			return;
		}

		isProcessingQueue.current = true;
		setIsReordering(true);

		while (operationQueue.current.length > 0) {
			const operation = operationQueue.current.shift();
			
			try {
				const success = await operation.action();
				if (!success) {
					// If operation failed, refresh from server to correct state
					await handleImageUpdate();
					break;
				}
			} catch (error) {
				console.error("Operation failed:", error);
				await handleImageUpdate();
				break;
			}
		}

		isProcessingQueue.current = false;
		setIsReordering(false);
	};

	const queueMoveOperation = (imageToMove, direction, serverAction) => {
		// Check if operations are blocked
		checkForActiveUser();
		if (isBlocked) {
			throw new Error('Another user is currently managing images. Please wait.');
		}

		// Claim active status for this user
		claimActiveStatus();

		// Apply optimistic update immediately
		setImages(prevImages => {
			const imagesCopy = [...prevImages];
			const currentIndex = imagesCopy.findIndex(img => img.id === imageToMove.id);
			
			if (direction === 'up' && currentIndex > 0) {
				[imagesCopy[currentIndex - 1], imagesCopy[currentIndex]] = 
				[imagesCopy[currentIndex], imagesCopy[currentIndex - 1]];
			} else if (direction === 'down' && currentIndex < imagesCopy.length - 1) {
				[imagesCopy[currentIndex], imagesCopy[currentIndex + 1]] = 
				[imagesCopy[currentIndex + 1], imagesCopy[currentIndex]];
			}
			
			return imagesCopy;
		});

		// Queue the server action
		operationQueue.current.push({
			action: () => serverAction(imageToMove),
			imageId: imageToMove.id,
			direction
		});

		// Process the queue
		processOperationQueue();
	};

	const contextValue = useMemo(() => ({
		images, 
		handleImageUpdate, 
		imagePreviewUrl, 
		handleImagePreview, 
		isReordering, 
		setIsReordering,
		queueMoveOperation,
		isBlocked,
		activeUser,
		currentUser,
		claimActiveStatus
	}), [images, handleImageUpdate, imagePreviewUrl, handleImagePreview, isReordering, isBlocked, activeUser, currentUser, claimActiveStatus]);

	return (

		<ImagesContext.Provider value={contextValue}>
			{children}
		</ImagesContext.Provider>

	)

}
