import '@/app/index.css';

import Alpine from 'alpinejs';

import createRpcClient from '@/app/rpc';
import cookies from '@/app/libs/cookies';
import i18n from '@/i18n';

(() => {
	const rpc = createRpcClient();
	const lang = (() => {
		const lang = cookies.get('lang');

		return i18n.supports(lang) ? lang : 'en-us';
	})();

	i18n.init(lang);
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
})();
