import "./globals.css";

const RootLayout = ({children}) => {
	return (

		<html>
			<body>
				<main>{children}</main>
			</body>
		</html>

	);
};

export default RootLayout;
