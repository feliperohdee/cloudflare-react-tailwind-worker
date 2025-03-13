import { ElementType } from 'react';
import HttpError from 'use-http-error';
import infer from 'use-infer';

import context from '@/worker/context';
import Router from 'use-request-utils/router';

type Route = {
	pathParams: Record<string, unknown>;
	queryParams: Record<string, unknown>;
	rawPath: string;
};

const router = new Router<ElementType>();

const add = (path: string, handler: ElementType) => {
	router.add('GET', path, handler);
};

const match = (url: URL) => {
	const route = router.match('GET', url.pathname);

	if (route.length === 0) {
		throw new HttpError(404);
	}

	const { handler, pathParams, rawPath } = route[0];
	const searchParams = new URLSearchParams(url.search);
	const queryParams = infer<Route['queryParams']>(
		Object.fromEntries(searchParams.entries())
	);

	context.setRoute({
		pathParams,
		queryParams,
		rawPath
	});

	return handler;
};

export type { Route };
export default { add, match };
