import { Helmet } from 'react-helmet-async';

import Hero from '@/worker/components/hero';

const Home = () => {
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
		</>
	);
};

export default Home;
