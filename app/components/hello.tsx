import exportComponent from '@/app/libs/export-web-component';
import useState from '@/app/hooks/use-state';

const Hello = ({ count2 }: { count2?: number }) => {
	const [state] = useState();

	return (
		<div className='text-4xl text-red-500'>
			Helleeeaaao {count2 || state.count}!
		</div>
	);
};

export default exportComponent(Hello, {
	props: {
		count2: 'number'
	}
});
