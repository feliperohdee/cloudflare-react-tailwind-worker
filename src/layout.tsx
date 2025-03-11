const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang='en'>
			<head>
				<title>My App</title>
				<meta
					charSet='utf-8'
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<link
					rel='stylesheet'
					href='/style.css'
				/>
			</head>
			<body>{children}</body>
		</html>
	);
};

export default Layout;
