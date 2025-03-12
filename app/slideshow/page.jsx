import getAllImages from "../actions/getAllImages";
import Carousel from "@/components/carousel";

const SlideshowPage = async () => {
	const imageData = await getAllImages();

	const images = imageData.map(
		(image) => (image.url)
	)

	return (

		<>
			{
				!images || images.length == 0
				? (
					<></>
				)
				: (
					<Carousel images={images}/>
				)
			}
		</>

	);
};

export default SlideshowPage;
