import { redirect } from "next/navigation";
import { getAuthUser } from "@/utils/pocketbase/server";

import LoginPage from "@/app/login/page";
import DashboardPage from "@/app/dashboard/page";

const HomePage = async () => {
	const user = await getAuthUser();

	if (!user) {
		redirect("/login");
	}

	redirect("/dashboard");
};

export default HomePage;
