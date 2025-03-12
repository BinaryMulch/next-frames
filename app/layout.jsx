import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

import {ToastContainer} from "react-toastify";

export const metadata = {
	title: "Next Frames"
}

const RootLayout = ({children}) => {
	return (

		<html className="h-full bg-gray-900">
			<body className="h-full">
				<main className="h-full">{children}</main>
				<ToastContainer />
			</body>
		</html>
		

	);
};

export default RootLayout;
