"use client";

import {useState, useEffect} from "react";
import Image from "next/image";

const Carousel = ({images}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(
		() => {
			if (!images || images.length === 0) return;

			const interval = setInterval(
				() => {
					setCurrentIndex(
						(lastIndex) => {
							if (!images || images.length === 0) return 0;
							return (lastIndex + 1) % images.length;
						}
					);
				},
				10000
			);

			return () => clearInterval(interval);
		},
		[images, images.length]
	);

	useEffect(
		() => {
			if (!images || images.length === 0) {
				setCurrentIndex(0);
				return;
			}

			if (currentIndex >= images.length) {
				setCurrentIndex(0);
			}
		}, [images, images.length, currentIndex]
	);

	return (

		<div className="cursor-none h-screen w-screen overflow-hidden relative bg-black">
			{images && images.length > 0 && (
				<div className="flex h-full transition-transform duration-700" style={{ transform: `translateX(-${Math.min(currentIndex, images.length - 1) * 100}vw)`}}>
					{
						images.map(
							(image, index) => (
								<div key={index} className="w-screen h-screen flex-shrink-0 relative">
									<Image
										src={image}
										fill
										className="object-contain"
										alt={`Slide ${index + 1}`}
										priority={index === currentIndex}
										sizes="100vw"
									/>
								</div>
							)
						)
					}
				</div>
			)}
		</div>

	);
};

export default Carousel;
