import {redirect} from "next/navigation";
import Image from "next/image";
import {createClient} from "@/utils/supabase/server";

import {ImagesProvider} from "../context/imagesContext";
import ImageUploadCard from "@/components/ImageUploadCard";
import ImageCardList from "@/components/imageCardList";
import ImageCard from "@/components/imageCard";
import ImagePreview from "@/components/imagePreview";
import {getAllImages} from "../actions/getAllImages";

const DashboardPage = async () => {
	const supabase = await createClient();

	// validate user session
	const {data: authData, error: authError} = await supabase.auth.getUser();
	if (authError || !authData.user) redirect("/login");

	// get images from database
	//const images = await getAllImages();
	const images = [];

	const handleImageUploadSuccess = async (response) => {
		//const images = await getAllImages();

	}

	return (

		<ImagesProvider>
			<section className="">
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 h-screen-dynamic">

					<div className="md:col-span-1 bg-gray-50 shadow-lg rounded-lg">
						<ImageUploadCard />
						<ImageCardList images={images} />
					</div>

					<div className="relative xl:col-span-2 bg-gray-50 shadow-lg rounded-lg">
						<ImagePreview />
					</div>
					
					

				</div>
			</section>
		</ImagesProvider>

	)
}

export default DashboardPage;
