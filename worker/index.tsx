import { createElement } from 'react';
import { renderToReadableStream } from 'react-dom/server';
import cookies from 'use-request-utils/cookies';
import headers from 'use-request-utils/headers';

import context from '@/worker/context';
import HomePage from '@/worker/pages/home';
import HttpError from 'use-http-error';
import i18n from '@/i18n';
import Layout from '@/worker/layout';
import meta from '@/worker/libs/meta';
import NotFoundPage from '@/worker/pages/not-found';
import router from '@/worker/libs/router';
import rpcHandler from '@/worker/rpc';

router.add('/', HomePage);
router.add('/:id', HomePage);
router.add('*', NotFoundPage);

const handler = {
	async fetch(
		request: Request,
		env: Env,
		executionContext: ExecutionContext
	): Promise<Response> {
		HttpError.setIncludeStack(env.PRODUCTION === 'false');

		const url = new URL(request.url);
		const lang = (() => {
			const lang =
				url.searchParams.get('lang') ||
				cookies.get(request.headers, 'lang') ||
				request.headers.get('accept-language') ||
				'';

			return i18n.supports(lang) ? lang : 'en-us';
		})();

		const res = await context.run(
			{
				env,
				executionContext,
				lang,
				request,
				url
			},
			async () => {
				try {
					i18n.init(lang);

					if (
						request.method === 'POST' &&
						url.pathname === '/api/rpc'
					) {
						return rpcHandler(request);
					}

					const route = router.match(url);
					const { links, preloads, scripts } =
						await meta.getManifest();

					const stream = await renderToReadableStream(
						<Layout
							links={links}
							preloads={preloads}
						>
							{createElement(route)}
						</Layout>,
						{ bootstrapModules: scripts }
					);

					return new Response(stream.pipeThrough(meta.injectHead()), {
						headers: headers.merge(context.getResponseHeaders(), {
							'cache-control': 'public, max-age=3600',
							'content-type': 'text/html'
						})
					});
				} catch (err) {
					const httpError = HttpError.wrap(err as Error);

					return httpError.toResponse();
				}
			}
		);

		// if the lang is set in the url, set it in the cookie to persist user language choice
		if (url.searchParams.has('lang')) {
			return new Response(res.body, {
				headers: cookies.set(res.headers, 'lang', lang),
				status: res.status
			});
		}

		return res;
	}
};

export default handler;
