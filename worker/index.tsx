import { createElement } from 'react';
import { renderToReadableStream } from 'react-dom/server';

import context from '@/worker/context';
import headers from 'use-request-utils/headers';
import HomePage from '@/worker/pages/home';
import HttpError from 'use-http-error';
import Layout from '@/worker/layout';
import meta from '@/worker/meta';
import NotFoundPage from '@/worker/pages/not-found';
import router from '@/worker/router';
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

		return context.run(
			{
				env,
				executionContext,
				request,
				url
			},
			async () => {
				try {
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
	}
};

export default handler;
