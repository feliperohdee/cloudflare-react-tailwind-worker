import '@/app/index.css';

import Alpine from 'alpinejs';

import createRpcClient from '@/app/rpc';
import cookies from '@/app/libs/cookies';
import i18n from '@/i18n';

(async () => {
	const rpc = createRpcClient();
	const toMarkdown = rpc.lazyResource('toMarkdown', {
		url: 'https://media.istockphoto.com/id/889405434/vector/realistic-paper-shop-receipt-vector-cashier-bill-on-white-background.jpg?s=612x612&w=0&k=20&c=M2GxEKh9YJX2W3q76ugKW23JRVrm0aZ5ZwCZwUMBgAg='
	});

	toMarkdown.on((event, data) => {
		console.log(event, data);
	});

	const lang = (() => {
		const lang = cookies.get('lang');

		return i18n.supports(lang) ? lang : 'en-us';
	})();

	i18n.load(lang);
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
