import { Helmet } from 'react-helmet-async';

import Hero from '@/worker/components/hero';

const Home = () => {
	return (
		<>
			<Helmet>
				<title>Cloudflare React Tailwind Worker | Home</title>
			</Helmet>
			<Hero />
		</>
	);
};

export default Home;
