import { AsyncLocalStorage } from 'async_hooks';
import { HelmetServerState } from 'react-helmet-async';

import { Route } from '@/worker/libs/router';

type ContextStore = {
	env: Env;
	executionContext: ExecutionContext;
	helmet: HelmetServerState;
	lang: string;
	route: Route;
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

	run<R>(
		args: Omit<ContextStore, 'helmet' | 'responseHeaders' | 'route'>,
		fn: () => R
	): R;
	run<R>(
		args: Omit<ContextStore, 'helmet' | 'responseHeaders' | 'route'>,
		fn: () => Promise<R>
	): Promise<R> {
		return this.storage.run(
			{
				...args,
				helmet: {} as HelmetServerState,
				route: {} as Route
			},
			fn
		);
	}

	setRoute(route: Route) {
		this.store.route = route;
	}
}

export default new Context();
