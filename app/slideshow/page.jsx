"use client";

import {useState, useEffect, useRef, useCallback} from "react";
import getAllImages from "../actions/getAllImages";
import Carousel from "@/components/carousel";

const SlideshowPage = () => {
	const [images, setImages] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const errorRefetchTimeout = useRef(null);
	const pendingImagesRef = useRef(null);

	const preloadUrls = (urls) => {
		return Promise.all(
			urls.map(
				(url) =>
					new Promise((resolve) => {
						const img = new window.Image();
						img.onload = resolve;
						img.onerror = resolve; // resolve anyway so we don't block
						img.src = url;
					})
			)
		);
	};

	const fetchImages = useCallback(async () => {
		try {
			const imageData = await getAllImages(false, false);
			const newUrls = imageData.map((image) => image.url);

			setError(null);

			// First load or single image — set images directly (no carousel cycling to trigger deferred swap)
			setImages((current) => {
				if (!current || current.length <= 1) {
					return newUrls;
				}

				// Same images — no update needed
				if (
					current.length === newUrls.length &&
					current.every((url, i) => url === newUrls[i])
				) {
					return current;
				}

				// Different images — preload new ones then defer swap
				const newOnes = newUrls.filter((url) => !current.includes(url));
				if (newOnes.length > 0) {
					preloadUrls(newOnes).then(() => {
						pendingImagesRef.current = newUrls;
					});
				} else {
					// Reorder only — defer to cycle boundary
					pendingImagesRef.current = newUrls;
				}
				return current;
			});
		} catch (err) {
			console.error("Error fetching images: ", err);
			// Only set error if we have no images to show
			setImages((current) => {
				if (!current || current.length === 0) {
					setError("Unable to load slideshow");
				}
				return current;
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleCycleComplete = useCallback(() => {
		if (pendingImagesRef.current) {
			setImages(pendingImagesRef.current);
			pendingImagesRef.current = null;
		}
	}, []);

	// Debounced refetch on image load error (e.g. deleted image returns 404)
	const handleImageError = useCallback(() => {
		if (errorRefetchTimeout.current) return;
		errorRefetchTimeout.current = setTimeout(() => {
			errorRefetchTimeout.current = null;
			fetchImages();
		}, 1000);
	}, [fetchImages]);

	useEffect(() => {
		return () => {
			if (errorRefetchTimeout.current) {
				clearTimeout(errorRefetchTimeout.current);
			}
		};
	}, []);

	useEffect(
		() => {
			fetchImages();

			const intervalId = setInterval(fetchImages, 300_000);
			return () => clearInterval(intervalId);
		}, [fetchImages]
	);

	return (

		<>
			{isLoading ? (
				<div className="h-[var(--height-screen-dynamic)] w-screen flex items-center justify-center bg-black">
					<div className="text-center animate-pulse">
						<p className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">Next Frames</p>
						<p className="text-gray-500 text-sm mt-2">Loading slideshow...</p>
					</div>
				</div>
			) : error ? (
				<div className="h-[var(--height-screen-dynamic)] w-screen flex items-center justify-center bg-black">
					<div className="text-center">
						<svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
						</svg>
						<p className="text-red-400 text-lg">{error}</p>
						<p className="text-gray-600 text-sm mt-1">Retrying automatically...</p>
					</div>
				</div>
			) : !images || images.length === 0 ? (
				<div className="h-[var(--height-screen-dynamic)] w-screen flex items-center justify-center bg-black">
					<div className="text-center">
						<svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
						</svg>
						<p className="text-gray-400 text-lg">No images to display</p>
						<p className="text-gray-600 text-sm mt-1">Upload images from the dashboard</p>
					</div>
				</div>
			) : (
				<Carousel images={images} onImageError={handleImageError} onCycleComplete={handleCycleComplete}/>
			)}
		</>

	);
};

export default SlideshowPage;
