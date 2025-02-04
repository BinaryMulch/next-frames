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

	return (

		<div className="cursor-none h-screen w-screen flex items-center justify-center overflow-hidden relative bg-black">
			<div className="flex transition-transform duration-700" style={{ transform: `translateX(-${currentIndex * 100}%)`}}>
				{
					images.map(
						(image, index) => (
							<img
								key={index}
								src={image}
								className="w-screen h-screen object-contain flex-shrink-0"
							/>
						)
					)
				}
			</div>
		</div>

	);
};

export default Carousel;
