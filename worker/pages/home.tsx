import map from 'lodash/map';

import { Helmet } from 'react-helmet-async';
import Hero from '@/worker/components/hero';
import md from '@/worker/libs/md';

const Home = async () => {
	const articles = import.meta.glob('@/worker/articles/*.md', {
		import: 'default',
		query: '?raw'
	});

	const html = await Promise.all(
		map(articles, async article => {
			return md(await article() as string);
		})
	);

	return (
		<>
			<Helmet>
				<title>Cloudflare React Tailwind Worker | Home</title>
				<meta
					name='description'
					content='Cloudflare React Tailwind Worker'
				/>
			</Helmet>
			<Hero />

			<div className='container mx-auto px-4 py-8'>
				{html.map((html, index) => (
					<div key={index} dangerouslySetInnerHTML={{ __html: html }} />
				))}
			</div>
		</>
	);
};

export default Home;
