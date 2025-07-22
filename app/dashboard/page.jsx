import {redirect} from "next/navigation";
import {getAuthUser} from "@/utils/pocketbase/server";

import Navbar from "@/components/navbar";
import {ImagesProvider} from "../context/imagesContext";
import ImageUploadCard from "@/components/ImageUploadCard";
import ImageCardList from "@/components/imageCardList";
import ImagePreview from "@/components/imagePreview";

const DashboardPage = async () => {
	// validate user session
	const user = await getAuthUser();
	if (!user) redirect("/login");

	return (

		<>
		<Navbar />
		<ImagesProvider>
			<section className="">
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 h-screen-dynamic">

					<div className="md:col-span-1 bg-gray-50 shadow-lg rounded-lg">
						<ImageUploadCard />
						<ImageCardList />
					</div>

					<div className="relative xl:col-span-2 bg-gray-50 shadow-lg rounded-lg">
						<ImagePreview />
					</div>
					
					

				</div>
			</section>
		</ImagesProvider>
		</>
		

	)
}

export default DashboardPage;
