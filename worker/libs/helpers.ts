import { env } from 'cloudflare:workers';
import map from 'lodash/map';
import parseViteManifest from 'use-vite-manifest-parser';
import reduce from 'lodash/reduce';

import context from '@/worker/context';

const getManifest = async () => {
	const { url } = context.store;

	if (env.PRODUCTION === 'false') {
		return {
			links: [],
			preloads: [],
			scripts: []
		};
	}

	const res = await env.ASSETS.fetch(
		new URL('.vite/manifest.json', `https://${url.host}`)
	);

	const manifest = parseViteManifest(await res.json());
	const assetUrl = (asset: string) => {
		return `https://${url.host}/${asset}`;
	};

	return {
		links: map(manifest.links, assetUrl),
		preloads: map(manifest.preloads, assetUrl),
		scripts: map(manifest.scripts, assetUrl)
	};
};

const injectHead = () => {
	const { helmet } = context.store;
	const head = reduce(
		helmet,
		(reduction, value) => {
			return reduction + value.toString();
		},
		''
	);

	let helmetInjected = false;

	return new TransformStream({
		transform(chunk, controller) {
			if (!helmetInjected) {
				const text = new TextDecoder().decode(chunk);

				if (text.includes('<template id="helmet"></template>')) {
					helmetInjected = true;
					controller.enqueue(
						new TextEncoder().encode(
							text.replace(
								'<template id="helmet"></template>',
								head
							)
						)
					);
				} else {
					controller.enqueue(chunk);
				}
			} else {
				controller.enqueue(chunk);
			}
		}
	});
};

export default {
	getManifest,
	injectHead
};
