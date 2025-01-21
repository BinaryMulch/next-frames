import {supabase} from "@/utils/supabase";

const HomePage = () => {

	const addView = async () => {
		const {data, error} = await supabase
			.from("views")
			.insert({

			});
		
		if (data) console.log(data);
		if (error) console.log(error);
	};

	addView();

	return (

		<div>Home</div>

	);
};

export default HomePage;
