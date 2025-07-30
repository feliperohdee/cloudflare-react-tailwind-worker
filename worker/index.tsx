import { createElement } from 'react';
import { renderToReadableStream } from 'react-dom/server.edge';
import cookies from 'use-request-utils/cookies';
import isPlainObject from 'lodash/isPlainObject';
import Rpc from 'use-request-utils/rpc';

import context from '@/worker/context';
import helpers from '@/worker/libs/helpers';
import HomePage from '@/worker/pages/home';
import HttpError from 'use-http-error';
import i18n from '@/i18n';
import Layout from '@/worker/layout';
import NotFoundPage from '@/worker/pages/not-found';
import RootRpc from '@/worker/rpc';
import router from '@/worker/libs/router';
import RpcPage from '@/worker/pages/rpc';

router.add('/', HomePage);
router.add('/rpc', RpcPage);
router.add('*', NotFoundPage);

const fetchRpc = async (rpc: Rpc, req: Request): Promise<Response> => {
	try {
		if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
			throw new HttpError(
				400,
				'Invalid content type, must be multipart/form-data'
			);
		}

		const form = await req.formData();
		const formBody = form.get('body');
		const formRpc = form.get('rpc') as string;
		const rpcRequest = Rpc.parseString(formRpc);

		if (!isPlainObject(rpcRequest)) {
			throw new HttpError(400);
		}

		return await rpc!.fetch(
			rpcRequest,
			new Request(req.url, {
				body: formBody || null,
				cf: req.cf,
				headers: req.headers,
				method: req.method
			})
		);
	} catch (err) {
		return HttpError.response(err as Error | HttpError);
	}
};

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
				url
			},
			async () => {
				try {
					i18n.load(lang);

					if (
						request.method === 'POST' &&
						url.pathname === '/api/rpc'
					) {
						const rpc = new RootRpc();

						return fetchRpc(rpc, request);
					}

					const route = router.match(url);
					const { links, preloads, scripts } =
						await helpers.getManifest();

					const stream = await renderToReadableStream(
						<Layout
							links={links}
							preloads={preloads}
						>
							{createElement(route)}
						</Layout>,
						{ bootstrapModules: scripts }
					);

					return new Response(stream.pipeThrough(helpers.injectHead()), {
						headers: {
							'cache-control': 'public, max-age=3600',
							'content-type': 'text/html'
						}
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
