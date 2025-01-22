import "./globals.css";

const RootLayout = ({children}) => {
	return (

		<html>
			<body className="bg-gray-50">
				<main>{children}</main>
			</body>
		</html>

	);
};

export default RootLayout;
