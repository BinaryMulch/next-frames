import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

import {ToastContainer} from "react-toastify";

const RootLayout = ({children}) => {
	return (

		<html>
			<body className="bg-primary-100">
				<main>{children}</main>
				<ToastContainer />
			</body>
		</html>

	);
};

export default RootLayout;
