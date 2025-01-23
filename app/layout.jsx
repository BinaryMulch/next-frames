import "./globals.css";

const RootLayout = ({children}) => {
	return (

		<html>
			<body className="bg-primary-100">
				<main>{children}</main>
			</body>
		</html>

	);
};

export default RootLayout;
