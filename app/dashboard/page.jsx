import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";

const DashboardPage = async () => {
	const supabase = await createClient();

	const {data, error} = await supabase.auth.getUser();

	if (error || !data.user) {
		redirect("/login");
	}

	return (

		<section>Dashboard</section>

	)
}

export default DashboardPage;
