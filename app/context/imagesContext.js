"use client";

import {createContext, useContext, useState, useRef, useEffect, useMemo, useCallback} from "react";
import {createClient} from "@/utils/pocketbase/client";

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
	const currentUserRef = useRef(null);
	const HEARTBEAT_INTERVAL = 5000; // 5 seconds
	const ACTIVE_USER_TIMEOUT = 15000; // 15 seconds

	// Keep ref in sync with state
	useEffect(() => {
		currentUserRef.current = currentUser;
	}, [currentUser]);

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

	// Plain internal functions declared in dependency order (no useCallback needed)

	function checkForActiveUser() {
		const stored = localStorage.getItem('activeUser');
		if (!stored) {
			setActiveUser(null);
			setIsBlocked(false);
			return;
		}

		const { userId, timestamp } = JSON.parse(stored);
		const now = Date.now();

		if (now - timestamp > ACTIVE_USER_TIMEOUT) {
			localStorage.removeItem('activeUser');
			setActiveUser(null);
			setIsBlocked(false);
			return;
		}

		setActiveUser(userId);
		setIsBlocked(currentUserRef.current && userId !== currentUserRef.current);
	}

	function updateActiveUser(userId) {
		const now = Date.now();
		const activeUserData = {
			userId,
			timestamp: now
		};
		localStorage.setItem('activeUser', JSON.stringify(activeUserData));
		checkForActiveUser();
	}

	function startHeartbeat(userId) {
		if (heartbeatInterval.current) {
			clearInterval(heartbeatInterval.current);
		}

		heartbeatInterval.current = setInterval(() => {
			updateActiveUser(userId);
		}, HEARTBEAT_INTERVAL);

		updateActiveUser(userId);
	}

	function claimActiveStatus() {
		if (currentUserRef.current) {
			updateActiveUser(currentUserRef.current);
			startHeartbeat(currentUserRef.current);
		}
	}

	// Initialize current user and set up heartbeat
	useEffect(() => {
		let mounted = true;
		let checkInterval;

		const initializeUser = async () => {
			const pb = createClient();
			const userId = pb.authStore.record?.id;
			if (userId && mounted) {
				setCurrentUser(userId);
				currentUserRef.current = userId;
				startHeartbeat(userId);

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

	const processOperationQueue = useCallback(async () => {
		if (isProcessingQueue.current || operationQueue.current.length === 0) {
			return;
		}

		isProcessingQueue.current = true;
		setIsReordering(true);

		let allSuccessful = true;

		while (operationQueue.current.length > 0) {
			const operation = operationQueue.current.shift();

			try {
				const success = await operation.action();
				if (!success) {
					allSuccessful = false;
					console.error("Operation failed for:", operation.imageId);
					break;
				}
			} catch (error) {
				console.error("Operation failed:", error);
				allSuccessful = false;
				break;
			}
		}

		if (!allSuccessful) {
			await handleImageUpdate();
		}

		await new Promise(resolve => setTimeout(resolve, 100));

		isProcessingQueue.current = false;
		setIsReordering(false);
	}, [handleImageUpdate]);

	const queueMoveOperation = useCallback((imageToMove, direction, serverAction) => {
		checkForActiveUser();
		if (isBlocked) {
			throw new Error('Another user is currently managing images. Please wait.');
		}

		claimActiveStatus();

		setImages(prevImages => {
			const imagesCopy = [...prevImages];
			const currentIndex = imagesCopy.findIndex(img => img.id === imageToMove.id);

			if (direction === 'up' && currentIndex > 0) {
				[imagesCopy[currentIndex - 1], imagesCopy[currentIndex]] =
				[imagesCopy[currentIndex], imagesCopy[currentIndex - 1]];

				imagesCopy.forEach((img, index) => {
					img.order_position = index + 1;
				});
			} else if (direction === 'down' && currentIndex < imagesCopy.length - 1) {
				[imagesCopy[currentIndex], imagesCopy[currentIndex + 1]] =
				[imagesCopy[currentIndex + 1], imagesCopy[currentIndex]];

				imagesCopy.forEach((img, index) => {
					img.order_position = index + 1;
				});
			}

			return imagesCopy;
		});

		operationQueue.current.push({
			action: () => serverAction(imageToMove),
			imageId: imageToMove.id,
			direction
		});

		processOperationQueue();
	}, [isBlocked, processOperationQueue]);

	const toggleImagePauseOptimistic = useCallback((imageId, serverAction) => {
		checkForActiveUser();
		if (isBlocked) {
			throw new Error('Another user is currently managing images. Please wait.');
		}

		claimActiveStatus();

		setImages(prevImages => {
			return prevImages.map(img =>
				img.id === imageId
					? { ...img, is_paused: !img.is_paused }
					: img
			);
		});

		serverAction().then(success => {
			if (!success) {
				setImages(prevImages => {
					return prevImages.map(img =>
						img.id === imageId
							? { ...img, is_paused: !img.is_paused }
							: img
					);
				});
			}
		}).catch(() => {
			setImages(prevImages => {
				return prevImages.map(img =>
					img.id === imageId
						? { ...img, is_paused: !img.is_paused }
						: img
				);
			});
		});
	}, [isBlocked]);

	const contextValue = useMemo(() => ({
		images,
		handleImageUpdate,
		imagePreviewUrl,
		handleImagePreview,
		isReordering,
		setIsReordering,
		queueMoveOperation,
		toggleImagePauseOptimistic,
		isBlocked,
		activeUser,
		currentUser,
		claimActiveStatus
	}), [images, handleImageUpdate, imagePreviewUrl, handleImagePreview, isReordering, queueMoveOperation, isBlocked, activeUser, currentUser, toggleImagePauseOptimistic]);

	return (

		<ImagesContext.Provider value={contextValue}>
			{children}
		</ImagesContext.Provider>

	)

}
