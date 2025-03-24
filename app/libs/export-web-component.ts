import { ComponentType } from 'react';

const define = <T extends ComponentType<any>>(
	component: T,
	options?: {
		shadow?: 'open' | 'closed';
		props?: Record<
			string,
			'string' | 'number' | 'boolean' | 'function' | 'json'
		>;
	}
) => {
	return {
		component,
		shadow: options?.shadow,
		props: options?.props
	};
};

export default define;
