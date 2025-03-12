import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import LoginPage from "@/app/login/page";
import DashboardPage from "@/app/dashboard/page";

const HomePage = async () => {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();

	if (error || !data.user) {
		redirect("/login");
	}

	redirect("/dashboard");
};

export default HomePage;
