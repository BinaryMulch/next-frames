import "./globals.css";

export const metadata = {
	title: "Next Frames"
}

const RootLayout = ({ children }) => {
	return (

		<html className="h-full bg-gray-900">
			<body className="h-full">
				<main className="h-full">{children}</main>
			</body>
		</html>
		

	);
};

export default RootLayout;
