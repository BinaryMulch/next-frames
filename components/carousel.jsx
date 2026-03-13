"use client";

import {useState, useEffect, useRef} from "react";
import Image from "next/image";

const Carousel = ({images, onImageError, onCycleComplete}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [progressKey, setProgressKey] = useState(0);
	const imagesRef = useRef(images);
	const prevImagesRef = useRef(null);
	const cycleCompleteRef = useRef(false);

	// Keep ref in sync for interval callback (fixes stale closure)
	imagesRef.current = images;

	// Clamp index during render to prevent blank frame
	const safeIndex = (!images || images.length === 0)
		? 0
		: Math.min(currentIndex, images.length - 1);

	// When images change, try to stay on the same image (fixes index drift)
	useEffect(() => {
		if (!images || images.length === 0) {
			setCurrentIndex(0);
			prevImagesRef.current = images;
			return;
		}

		const prevImages = prevImagesRef.current;
		prevImagesRef.current = images;

		if (prevImages && prevImages.length > 0) {
			setCurrentIndex(prev => {
				const oldUrl = prevImages[Math.min(prev, prevImages.length - 1)];
				if (oldUrl) {
					const newIdx = images.indexOf(oldUrl);
					if (newIdx !== -1) return newIdx;
				}
				return Math.min(prev, images.length - 1);
			});
		}
	}, [images]);

	// Auto-advance — uses ref for length so interval never resets on image changes
	useEffect(() => {
		if (!images || images.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex(prev => {
				const len = imagesRef.current?.length || 1;
				const next = (prev + 1) % len;
				// Flag cycle completion — actual callback fires in useEffect
				if (next === 0) {
					cycleCompleteRef.current = true;
				}
				return next;
			});
		}, 10000);

		return () => clearInterval(interval);
		// Only depend on images.length so interval resets when count changes (0→N or N→1)
		// but not on every refetch with same count
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [images?.length]);

	// Fire onCycleComplete after render (avoids setState-during-render)
	useEffect(() => {
		if (cycleCompleteRef.current) {
			cycleCompleteRef.current = false;
			onCycleComplete?.();
		}
	}, [currentIndex, onCycleComplete]);

	// Reset progress bar on slide change
	useEffect(() => {
		setProgressKey(prev => prev + 1);
	}, [safeIndex, images]);

	// Preload next image
	useEffect(() => {
		if (!images || images.length <= 1) return;
		const nextIndex = (safeIndex + 1) % images.length;
		const img = new window.Image();
		img.src = images[nextIndex];
	}, [safeIndex, images]);

	return (

		<div className="cursor-none h-[var(--height-screen-dynamic)] w-screen overflow-hidden relative bg-black">
			{images && images.length > 0 && (
				<>
					{images.map((image, index) => (
						<div
							key={image}
							className="absolute inset-0 transition-opacity duration-1000"
							style={{opacity: index === safeIndex ? 1 : 0}}
						>
							<Image
								src={image}
								fill
								className="object-contain"
								alt={`Slide ${index + 1}`}
								priority={index === safeIndex}
								sizes="100vw"
								onError={() => onImageError?.()}
							/>
						</div>
					))}

					{/* Progress bar (hidden for single image) */}
				{images.length > 1 && (
					<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
						<div
							key={progressKey}
							className="h-full bg-white/30"
							style={{animation: 'progressFill 10s linear forwards'}}
						/>
					</div>
				)}
				</>
			)}
		</div>

	);
};

export default Carousel;
