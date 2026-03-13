"use client";

import {useState, useEffect, useRef} from "react";
import Image from "next/image";

const Carousel = ({images}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [progressKey, setProgressKey] = useState(0);

	useEffect(
		() => {
			if (!images || images.length === 0) {
				setCurrentIndex(0);
				return;
			}

			// Clamp index if images were removed
			setCurrentIndex(prev => prev >= images.length ? 0 : prev);

			const interval = setInterval(
				() => {
					setCurrentIndex(
						(lastIndex) => {
							if (!images || images.length === 0) return 0;
							return (lastIndex + 1) % images.length;
						}
					);
					setProgressKey(prev => prev + 1);
				},
				10000
			);

			return () => clearInterval(interval);
		},
		[images]
	);

	// Reset progress bar on index change
	useEffect(() => {
		setProgressKey(prev => prev + 1);
	}, [currentIndex]);

	return (

		<div className="cursor-none h-screen w-screen overflow-hidden relative bg-black">
			{images && images.length > 0 && (
				<>
					{images.map((image, index) => (
						<div
							key={image}
							className="absolute inset-0 transition-opacity duration-1000"
							style={{opacity: index === currentIndex ? 1 : 0}}
						>
							<Image
								src={image}
								fill
								className="object-contain"
								alt={`Slide ${index + 1}`}
								priority={index === currentIndex}
								sizes="100vw"
							/>
						</div>
					))}

					{/* Progress bar */}
					<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
						<div
							key={progressKey}
							className="h-full bg-white/30"
							style={{animation: 'progressFill 10s linear forwards'}}
						/>
					</div>
				</>
			)}
		</div>

	);
};

export default Carousel;
