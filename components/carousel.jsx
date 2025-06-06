"use client";

import {useState, useEffect} from "react";

const Carousel = ({images}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(
		() => {
			if (!images || images.length == 0) return;

			const interval = setInterval(
				() => {
					setCurrentIndex(
						(lastIndex) => (lastIndex + 1) % images.length
					);
				},
				10000
			);

			return () => clearInterval(interval);
		},
		[images.length]
	);

	useEffect(
		() => {
			if (images.length == 0) {
				setCurrentIndex(0);
				return;
			}

			if (currentIndex >= images.length) {
				setCurrentIndex(0);
			}
		}, [images.length, currentIndex]
	);

	return (

		<div className="cursor-none h-screen w-screen overflow-hidden relative bg-black">
			<div className="flex h-full transition-transform duration-700" style={{ transform: `translateX(-${currentIndex * 100}vw)`}}>
				{
					images.map(
						(image, index) => (
							<div key={index} className="w-screen h-screen flex-shrink-0">
								<img
									key={index}
									src={image}
									className="w-screen h-screen object-contain flex-shrink-0"
								/>
							</div>
						)
					)
				}
			</div>
		</div>

	);
};

export default Carousel;
