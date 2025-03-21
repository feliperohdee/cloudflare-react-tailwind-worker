import debounce from 'lodash/debounce';
import HttpError from 'use-http-error';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import {
	JsonRpcRequest,
	rpcClient,
	RpcTransport,
	RpcTranscoder,
	RpcUuid
} from 'typed-rpc';

import type { Rpc } from '@/worker/rpc';

type RpcEvent = 'loading-start' | 'loading-end' | 'loaded' | 'data' | 'error';

type ResourceState<T> = {
	data: T | null;
	error: HttpError | null;
	index: number;
	loaded: boolean;
	loading: boolean;
};

type ResourceListeners<T> = {
	on: ((event: RpcEvent, state: ResourceState<T>) => void)[];
	onData: ((data: T) => void)[];
	onError: ((error: HttpError) => void)[];
	onLoaded: ((loaded: boolean) => void)[];
	onLoading: ((loading: boolean) => void)[];
};

type FetchOptions = {
	credentials?: RequestCredentials;
	getHeaders?():
		| Record<string, string>
		| Promise<Record<string, string>>
		| undefined;
	url: string;
};

type RpcClientOptions = (FetchOptions | { transport: RpcTransport }) & {
	abortable?: boolean;
	debounceTime?: number;
	transcoder?: RpcTranscoder<any>;
	uuid?: RpcUuid;
};

const transport = (options: FetchOptions): RpcTransport => {
	return async (req: JsonRpcRequest, signal: AbortSignal): Promise<any> => {
		try {
			const headers = options?.getHeaders
				? await options.getHeaders()
				: {};

			const res = await fetch(options.url, {
				body: JSON.stringify(req),
				credentials: options?.credentials,
				headers: {
					accept: 'application/json',
					'content-type': 'application/json',
					...headers
				},
				method: 'POST',
				signal
			});

			if (!res.ok) {
				throw new HttpError(res.status, res.statusText);
			}

			const data = await res.json();

			if (data && isObject(data) && 'error' in data) {
				throw new HttpError(
					(data.error as { code: number }).code,
					(data.error as { message: string }).message,
					{ context: (data.error as { data: object }).data }
				);
			}

			return data;
		} catch (err) {
			throw HttpError.wrap(err as Error);
		}
	};
};

const createRpcClient = (options?: RpcClientOptions) => {
	let rpc: any;

	if (options && 'transport' in options) {
		rpc = rpcClient<Rpc>(options);
	} else if (
		options &&
		('credentials' in options ||
			'getHeaders' in options ||
			'url' in options)
	) {
		rpc = rpcClient<Rpc>({
			transcoder: options?.transcoder,
			transport: transport({
				credentials: options.credentials,
				getHeaders: options.getHeaders,
				url: options.url || '/api/rpc'
			}),
			uuid: options?.uuid
		});
	} else {
		rpc = rpcClient<Rpc>({
			transport: transport({ url: '/api/rpc' })
		});
	}

	const pendingPromises = new Map<Promise<any>, boolean>();
	const resourceFactory = ({ lazy }: { lazy: boolean }) => {
		return <T extends keyof Rpc>(
			method: T,
			...initialArgs: Parameters<Rpc[T]>
		) => {
			type Args = Parameters<Rpc[T]>;
			type Data = Awaited<ReturnType<Rpc[T]>>;

			let currentPromise: Promise<any> | null = null;
			let firstExecute = false;
			let prev: { method: T; args: Args } = {
				method,
				args: initialArgs
			};

			let state: ResourceState<Data> = {
				data: null,
				error: null,
				index: 0,
				loaded: false,
				loading: false
			};

			const listeners: ResourceListeners<Data> = {
				on: [],
				onData: [],
				onError: [],
				onLoaded: [],
				onLoading: []
			};

			const setData = (update: Data | ((data: Data) => Data)): Data => {
				const newData = isFunction(update)
					? (update as (data: Data) => Data)(state.data as Data)
					: update;

				state = {
					...state,
					data: newData
				};

				listeners.on.forEach(callback => {
					callback('data', state);
				});

				listeners.onData.forEach(callback => {
					callback(newData);
				});

				return newData;
			};

			const fetch = async (...overrideArgs: Args | []): Promise<Data> => {
				try {
					const prevLoading = state.loading;
					const prevLoaded = state.loaded;

					state = {
						...state,
						error: null,
						index: state.index + 1,
						loading: true,
						loaded: false
					};

					if (prevLoading !== true) {
						listeners.on.forEach(callback => {
							callback('loading-start', state);
						});

						listeners.onLoading.forEach(callback => {
							callback(true);
						});
					}

					if (prevLoaded !== false) {
						listeners.on.forEach(callback => {
							callback('loaded', state);
						});

						listeners.onLoaded.forEach(callback => {
							callback(false);
						});
					}

					if (!isFunction(rpc[method])) {
						throw new HttpError(404, 'Method not found');
					}

					console.log({ overrideArgs });

					const args = overrideArgs.length
						? overrideArgs
						: initialArgs;
					const promise = rpc[method](...args);
					currentPromise = promise;

					const abortable = options?.abortable ?? true;
					if (abortable) {
						pendingPromises.set(promise, true);
					}

					const data = await promise;

					if (abortable) {
						pendingPromises.delete(promise);
					}

					state = {
						...state,
						data,
						loading: false,
						loaded: true
					};

					listeners.on.forEach(callback => {
						callback('data', state);
						callback('loaded', state);
						callback('loading-end', state);
					});

					listeners.onData.forEach(callback => {
						callback(data);
					});

					listeners.onLoading.forEach(callback => {
						callback(false);
					});

					listeners.onLoaded.forEach(callback => {
						callback(true);
					});

					return data;
				} catch (err) {
					const httpError = HttpError.wrap(err as Error);

					if (httpError.message.includes('aborted')) {
						return state.data as Data;
					}

					state = {
						...state,
						error: httpError,
						loading: false,
						loaded: false
					};

					listeners.on.forEach(callback => {
						callback('error', state);
						callback('loading-end', state);
					});

					listeners.onError.forEach(callback => {
						callback(httpError);
					});

					listeners.onLoading.forEach(callback => {
						callback(false);
					});

					throw httpError;
				}
			};

			// Create debounced check and execute function
			const debouncedCheckAndExecute = debounce(() => {
				if (
					method !== prev.method ||
					!isEqual(initialArgs, prev.args)
				) {
					if (options?.abortable ?? true) {
						if (
							currentPromise &&
							pendingPromises.has(currentPromise)
						) {
							rpc.$abort(currentPromise);
							pendingPromises.delete(currentPromise);
						}
					}

					prev = { method, args: initialArgs };
					fetch();
				}
			}, options?.debounceTime ?? 300);

			if (!firstExecute && !lazy) {
				firstExecute = true;
				fetch();
			}

			return {
				getState: (): ResourceState<Data> => {
					return { ...state };
				},
				fetch,
				on: (
					callback: (
						event: RpcEvent,
						state: ResourceState<Data>
					) => void
				): (() => void) => {
					listeners.on.push(callback);

					return () => {
						listeners.on = listeners.on.filter(
							cb => cb !== callback
						);
					};
				},
				onData: (callback: (data: Data) => void): (() => void) => {
					listeners.onData.push(callback);

					return () => {
						listeners.onData = listeners.onData.filter(
							cb => cb !== callback
						);
					};
				},
				onError: (
					callback: (error: HttpError) => void
				): (() => void) => {
					listeners.onError.push(callback);

					return () => {
						listeners.onError = listeners.onError.filter(
							cb => cb !== callback
						);
					};
				},
				onLoading: (
					callback: (loading: boolean) => void
				): (() => void) => {
					listeners.onLoading.push(callback);

					return () => {
						listeners.onLoading = listeners.onLoading.filter(
							cb => cb !== callback
						);
					};
				},
				onLoaded: (
					callback: (loaded: boolean) => void
				): (() => void) => {
					listeners.onLoaded.push(callback);

					return () => {
						listeners.onLoaded = listeners.onLoaded.filter(
							cb => cb !== callback
						);
					};
				},
				setData,
				updateArgs: (...newArgs: Args): void => {
					initialArgs = newArgs as unknown as Args;
					debouncedCheckAndExecute();
				},
				cancelPending: (): void => {
					debouncedCheckAndExecute.cancel();
				},
				dispose: (): void => {
					debouncedCheckAndExecute.cancel();
					listeners.on = [];
					listeners.onData = [];
					listeners.onError = [];
					listeners.onLoading = [];
					listeners.onLoaded = [];

					if (currentPromise && pendingPromises.has(currentPromise)) {
						rpc.$abort(currentPromise);
						pendingPromises.delete(currentPromise);
					}
				}
			};
		};
	};

	return {
		lazyResource: resourceFactory({ lazy: true }),
		rpc: rpc,
		resource: resourceFactory({ lazy: false }),
		abortAll: (): void => {
			pendingPromises.forEach((_, promise) => {
				rpc.$abort(promise);
			});
			pendingPromises.clear();
		}
	};
};

export default createRpcClient;
