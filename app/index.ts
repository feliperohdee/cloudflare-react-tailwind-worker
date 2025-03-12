import '@/app/index.css';

import Alpine from 'alpinejs';
import createRpcClient from '@/app/rpc';
const rpc = createRpcClient();

Alpine.data('button', () => ({
	open: false,
	async toggle(e: Event) {
		e.preventDefault();

		const resource = rpc.resource('hello', {
			message: 'Hello World'
		});

		resource.on((event, data) => {
			console.log(event, data);
		});

		this.open = !this.open;
	}
}));

// @ts-expect-error
window.Alpine = Alpine;

Alpine.start();
