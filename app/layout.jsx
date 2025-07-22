import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

import {ToastContainer} from "react-toastify";
import {ThemeProvider} from "./context/themeContext";

export const metadata = {
	title: "Next Frames - Professional Slideshow Management",
	description: "Enterprise-grade image slideshow management system with real-time updates, theme customization, and advanced UI optimization. Built with Next.js 15 and Supabase.",
	keywords: "slideshow, image management, Next.js, React, Supabase, dashboard, presentation",
	version: "0.3.0"
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
