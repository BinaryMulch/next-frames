import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

import {ToastContainer} from "react-toastify";
import {ThemeProvider} from "./context/themeContext";

export const metadata = {
	title: "Next Frames"
}

const RootLayout = ({children}) => {
	return (

		<html className="h-full">
			<body className="h-full">
				<ThemeProvider>
					<main className="h-full">{children}</main>
					<ToastContainer />
				</ThemeProvider>
			</body>
		</html>
		

	);
};

export default RootLayout;
