import '@/app/index.css';

import createRpcClient from '@/app/rpc';
import cookies from '@/app/libs/cookies';
import i18n from '@/i18n';

(() => {
	const rpc = createRpcClient();
	const lang = (() => {
		const lang = cookies.get('lang');

		return i18n.supports(lang) ? lang : 'en-us';
	})();

	i18n.load(lang);

	const buttons = document.querySelectorAll('button');

	buttons.forEach(button => {
		button.addEventListener('click', (e) => {
			e.preventDefault();

			const resource = rpc.resource('hello', {
				message: 'Hello World'
			});

			resource.on((event, data) => {
				console.log(event, data);
			});
		});
	});	
})();
