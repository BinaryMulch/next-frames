import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";

import Navbar from "@/components/navbar";
import {ImagesProvider} from "../context/imagesContext";
import ImageUploadCard from "@/components/ImageUploadCard";
import ImageCardList from "@/components/imageCardList";
import ImagePreview from "@/components/imagePreview";
import ActiveUserBanner from "@/components/activeUserBanner";

const DashboardPage = async () => {
	const supabase = await createClient();

	// validate user session
	const {data: authData, error: authError} = await supabase.auth.getUser();
	if (authError || !authData.user) redirect("/login");

	return (

		<>
		<Navbar />
		<ImagesProvider>
			<section className="h-[calc(100vh-65px)] bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
				<div className="h-full flex flex-col px-6 py-6">
					<ActiveUserBanner />
					<div className="mb-6 flex-shrink-0">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
						<p className="text-gray-600 dark:text-gray-400 text-lg">Manage your slideshow images and preview them in real-time</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 min-h-0">

						<div className="md:col-span-1 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col transition-colors duration-200">
							<ImageUploadCard />
							<ImageCardList />
						</div>

						<div className="relative xl:col-span-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden p-4 transition-colors duration-200">
							<ImagePreview />
						</div>
						
					</div>
				</div>
			</section>
		</ImagesProvider>
		</>
		

	)
}

export default DashboardPage;
