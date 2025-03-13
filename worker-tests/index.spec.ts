import { describe, it, expect } from 'vitest';
import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF
} from 'cloudflare:test';

import worker from '@/worker/index';

describe('/index', () => {
	it('should responds (unit style)', async () => {
		const request = new Request('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);
		expect(await response.text()).toContain(`<html lang="en">`);
	});

	it('responds with Hello World! (integration style)', async () => {
		const response = await SELF.fetch('https://example.com');

		expect(await response.text()).toContain(`<html lang="en">`);
	});

	describe('/api/rpc', () => {
		it('should respond to rpc requests (unit style)', async () => {
			const request = new Request('http://example.com/api/rpc', {
				method: 'POST',
				body: JSON.stringify({
					id: 1,
					jsonrpc: '2.0',
					method: 'hello',
					params: [
						{
							message: 'World'
						}
					]
				})
			});

			const ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);

			await waitOnExecutionContext(ctx);
			expect(await response.json()).toEqual({
				jsonrpc: '2.0',
				id: 1,
				result: {
					message: 'Hello, World!',
					url: 'http://example.com/api/rpc'
				}
			});
		});

		it('should respond to rpc requests (integration style)', async () => {
			const response = await SELF.fetch('https://example.com/api/rpc', {
				method: 'POST',
				body: JSON.stringify({
					id: 1,
					jsonrpc: '2.0',
					method: 'hello',
					params: [
						{
							message: 'World'
						}
					]
				})
			});

			expect(await response.json()).toEqual({
				jsonrpc: '2.0',
				id: 1,
				result: {
					message: 'Hello, World!',
					url: 'https://example.com/api/rpc'
				}
			});
		});
	});
});
