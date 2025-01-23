import {redirect} from "next/navigation";
import Image from "next/image";
import {createClient} from "@/utils/supabase/server";
import ImageUpload from "@/components/ImageUpload";
import ImageCard from "@/components/imageCard";

const DashboardPage = async () => {
	const supabase = await createClient();

	// validate user session
	const {data, error} = await supabase.auth.getUser();
	if (error || !data.user) redirect("/login");

	// get images from database


	return (

		<section className="">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-screen-dynamic">
				<div className="md:col-span-1 border-2 border-primary-300 rounded-lg">
					<ImageUpload />
					<div className="flex flex-col gap-2 p-4">

						<ImageCard />
						<ImageCard />
						<ImageCard />

					</div>
				</div>
				<div className="relative md:col-span-2 border-2 border-primary-300 rounded-lg">
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
