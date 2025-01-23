import {redirect} from "next/navigation";
import Image from "next/image";
import {createClient} from "@/utils/supabase/server";
import ImageCard from "@/components/imageCard";

const DashboardPage = async () => {
	const supabase = await createClient();

	const {data, error} = await supabase.auth.getUser();

	if (error || !data.user) {
		redirect("/login");
	}

	return (

		<section className="p-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<div className="md:col-span-1 border-2 border-gray-300">
					<div className="flex flex-col gap-2 p-4">

						<ImageCard />
						<ImageCard />
						<ImageCard />

					</div>
				</div>
				<div className="md:col-span-2 border-2 border-gray-300">
					<Image
						src="/placeholder_1920x1080.png"
						width={500}
						height={500}
						sizes="100vw"
						alt=""
					/>
				</div>
			</div>
		</section>

	)
}

export default DashboardPage;
