import { HelmetProvider, Helmet } from 'react-helmet-async';
import map from 'lodash/map';

import context from '@/worker/context';

const Layout = ({
	children,
	links,
	preloads
}: {
	children: React.ReactNode;
	links: string[];
	preloads: string[];
}) => {
	const { env } = context.store;

	return (
		<HelmetProvider context={context.store}>
			<html lang='en'>
				<head>
					<link
						rel='icon'
						href='/images/icon.png'
					/>
					<meta
						charSet='utf-8'
						name='viewport'
						content='width=device-width, initial-scale=1'
					/>
					{map(links, link => (
						<link
							key={link}
							rel='stylesheet'
							href={link}
						/>
					))}

					{map(preloads, preload => (
						<link
							key={preload}
							rel='preload'
							href={preload}
						/>
					))}

					<Helmet>
						<title>Cloudflare React Tailwind Worker</title>
					</Helmet>
					<template id='helmet' />
				</head>
				<body>{children}</body>
				{env.PRODUCTION === 'false' ? (
					<>
						<script
							type='module'
							src='http://localhost:5173/@vite/client'
						/>
						<script
							type='module'
							src='http://localhost:5173/app/index.tsx'
						/>
					</>
				) : null}
			</html>
		</HelmetProvider>
	);
};

export default Layout;
