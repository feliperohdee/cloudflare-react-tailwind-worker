import parseViteManifest from 'use-vite-manifest-parser';
import reduce from 'lodash/reduce';

import context from '@/worker/context';

const getManifest = async () => {
	const { env, url } = context.store;

	if (env.PRODUCTION === 'false') {
		return {
			links: [],
			preloads: [],
			scripts: []
		};
	}

	const res = await env.ASSETS.fetch(new URL('.vite/manifest.json', url));

	const manifest = parseViteManifest(await res.json());

	return {
		links: manifest.links,
		preloads: manifest.preloads,
		scripts: manifest.scripts
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
