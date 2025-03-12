import { Menu } from 'lucide-react';

const navigation = [
	{
		name: 'Cloudflare Docs',
		href: 'https://developers.cloudflare.com/workers/'
	},
	{ name: 'Tailwind CSS', href: 'https://tailwindcss.com/docs' },
	{ name: 'React Docs', href: 'https://react.dev/' }
];

const Hero = () => {
	return (
		<div className='h-screen overflow-hidden bg-gray-900'>
			<header className='absolute inset-x-0 top-0 z-50'>
				<nav
					aria-label='Global'
					className='flex items-center justify-between p-6 lg:px-8'
				>
					<div className='flex lg:flex-1'>
						<a
							href='https://github.com/feliperohdee/cloudflare-react-tailwind-worker'
							className='-m-1.5 p-1.5'
						>
							<span className='sr-only'>
								Cloudflare React Tailwind Worker
							</span>
							<img
								alt=''
								src='/images/mark.svg'
								className='h-8 w-auto'
							/>
						</a>
					</div>
					<div className='flex lg:hidden'>
						<button
							type='button'
							className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400'
						>
							<span className='sr-only'>Open main menu</span>
							<Menu
								aria-hidden='true'
								className='size-6'
							/>
						</button>
					</div>
					<div className='hidden lg:flex lg:gap-x-12'>
						{navigation.map(item => (
							<a
								key={item.name}
								href={item.href}
								className='text-sm/6 font-semibold text-gray-300 hover:text-white'
							>
								{item.name}
							</a>
						))}
					</div>
					<div className='hidden lg:flex lg:flex-1 lg:justify-end'>
						<a
							href='https://github.com/feliperohdee/cloudflare-react-tailwind-worker'
							className='text-sm/6 font-semibold text-gray-300 hover:text-white'
						>
							Get Started <span aria-hidden='true'>&rarr;</span>
						</a>
					</div>
				</nav>
			</header>

			<div className='relative isolate px-6 pt-14 lg:px-8'>
				<div
					aria-hidden='true'
					className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
						}}
						className='relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#4f46e5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
					/>
				</div>
				<div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
					<div className='hidden sm:mb-8 sm:flex sm:justify-center'>
						<div className='relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-gray-600 hover:ring-gray-300'>
							Modern edge computing with React and Tailwind.{' '}
							<a
								href='https://github.com/feliperohdee/cloudflare-react-tailwind-worker'
								className='font-semibold text-indigo-400'
							>
								<span
									aria-hidden='true'
									className='absolute inset-0'
								/>
								Learn more{' '}
								<span aria-hidden='true'>&rarr;</span>
							</a>
						</div>
					</div>
					<div className='text-center'>
						<h1 className='text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl'>
							Edge-Powered React with Tailwind CSS
						</h1>
						<p className='mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8'>
							Build lightning-fast web applications with the power
							of Cloudflare Workers, React 19, and Tailwind CSS
							v4. Deploy globally and deliver exceptional user
							experiences from the edge.
						</p>
						<div
							x-data='button'
							className='mt-10 flex items-center justify-center gap-x-6'
						>
							<a
								x-on:click='toggle'
								href='https://github.com/feliperohdee/cloudflare-react-tailwind-worker'
								className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
							>
								Get started
							</a>
							<a
								href='https://github.com/feliperohdee/cloudflare-react-tailwind-worker'
								className='text-sm/6 font-semibold text-gray-300 hover:text-white'
							>
								View on GitHub <span aria-hidden='true'>→</span>
							</a>
						</div>
					</div>
				</div>
				<div
					aria-hidden='true'
					className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'
				>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
						}}
						className='relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#4f46e5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
					/>
				</div>
			</div>
		</div>
	);
};

export default Hero;
