import { useEffect } from 'react';

import exportComponent from '@/app/libs/export-web-component';
import useState from '@/app/hooks/use-state';

const App = () => {
	const [, setState] = useState();

	useEffect(() => {
		setInterval(() => {
			setState(state => {
				return {
					...state,
					count: state.count + 1
				};
			});
		}, 1000);
	}, []);

	return (
		<div className='text-4xl text-red-500'>
			<slot name='hello' />
		</div>
	);
};

export default exportComponent(App, {
	shadow: 'closed'
});
