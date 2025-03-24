import { Code2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/app/components/ui/card';
import Footer from '@/worker/components/footer';
import Hero from '@/worker/components/hero';
import Nav from '@/worker/components/nav';

const Rpc = () => {
	return (
		<>
			<Helmet>
				<title>Cloudflare React Tailwind Worker | Home</title>
			</Helmet>
			<Hero />
			<div className='min-h-screen bg-black text-gray-200'>
				<div className='container mx-auto px-4 py-8'>
					<Nav />
					<Card className='mx-auto max-w-3xl border-gray-800 bg-gray-900'>
						<CardHeader>
							<CardTitle className='flex items-center text-xl text-white'>
								<Code2 className='mr-2 h-5 w-5 text-blue-500' />
								Type-Safe RPC Communication Demo
							</CardTitle>
						</CardHeader>

						<CardContent className='p-6'>
							<x-rpc />
						</CardContent>
					</Card>

					<Footer />
				</div>
			</div>
		</>
	);
};

export default Rpc;
