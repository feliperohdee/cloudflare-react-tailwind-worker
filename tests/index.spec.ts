import { describe, it, expect } from 'vitest';
import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF
} from 'cloudflare:test';

import worker from '@/index';

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
});
