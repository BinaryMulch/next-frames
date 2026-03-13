import { redirect } from "next/navigation";
import { createClient } from "@/utils/pocketbase/server";

const HomePage = async () => {
	const pb = await createClient();

	if (!pb.authStore.isValid) {
		redirect("/login");
	}

	redirect("/dashboard");
};

export default HomePage;
