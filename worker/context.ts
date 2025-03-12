import { AsyncLocalStorage } from 'async_hooks';
import { HelmetServerState } from 'react-helmet-async';
import headers from 'use-request-utils/headers';

type ContextStore = {
	env: Env;
	executionContext: ExecutionContext;
	helmet: HelmetServerState;
	request: Request;
	responseHeaders: Headers;
	url: URL;
};

class Context {
	private storage = new AsyncLocalStorage<ContextStore>();

	get store() {
		const store = this.storage.getStore();

		if (!store) {
			throw new Error('No store found');
		}

		return store;
	}

	getResponseHeaders() {
		return this.store.responseHeaders;
	}

	mergeResponseHeaders(newHeaders: Headers) {
		this.store.responseHeaders = headers.merge(
			this.store.responseHeaders,
			newHeaders
		);
	}

	run<R>(
		args: Omit<ContextStore, 'helmet' | 'responseHeaders'>,
		fn: () => R
	): R;
	run<R>(
		args: Omit<ContextStore, 'helmet' | 'responseHeaders'>,
		fn: () => Promise<R>
	): Promise<R> {
		return this.storage.run(
			{
				...args,
				helmet: {} as HelmetServerState,
				responseHeaders: new Headers()
			},
			fn
		);
	}

	setResponseHeaders(newHeaders: Headers) {
		this.store.responseHeaders = newHeaders;
	}
}

export default new Context();
