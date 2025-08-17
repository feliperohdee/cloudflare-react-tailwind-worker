import { env } from 'cloudflare:workers';
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
					{map(links, link => {
						return (
							<link
								key={link}
								rel='stylesheet'
								href={link}
							/>
						);
					})}

					{map(preloads, preload => {
						return (
							<link
								key={preload}
								rel='preload'
								href={preload}
							/>
						);
					})}

					<Helmet>
						<title>Cloudflare React Tailwind Worker</title>
					</Helmet>
					<template id='helmet' />
				</head>
				<body>
					{children}
					<x-toastr />
				</body>
				{env.PRODUCTION === 'false' ? (
					<>
						<script
							type='module'
							src='/@vite/client'
						/>
						<script
							type='module'
							src='/app/index.ts'
						/>
					</>
				) : null}
			</html>
		</HelmetProvider>
	);
};

export default Layout;
