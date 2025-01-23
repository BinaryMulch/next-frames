import {redirect} from "next/navigation";
import Image from "next/image";
import {createClient} from "@/utils/supabase/server";

import ImageUploadCard from "@/components/ImageUploadCard";
import ImageCardList from "@/components/imageCardList";
import ImageCard from "@/components/imageCard";
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

		<section className="">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-screen-dynamic">

				<div className="md:col-span-1 bg-gray-50 shadow-lg rounded-lg">
					<ImageUploadCard />
					<ImageCardList images={images} />
				</div>

				<div className="relative md:col-span-2 bg-gray-50 shadow-lg rounded-lg">
					<Image
						className="object-contain"
						src="/placeholder_1920x1080.png"
						fill
						alt=""
					/>
				</div>

			</div>
		</section>

	)
}

export default DashboardPage;
