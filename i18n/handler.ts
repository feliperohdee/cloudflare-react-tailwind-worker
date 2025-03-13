import _ from 'lodash';

let cache: Record<string, string> = {};
let translations: Record<string, string> = {};

const init = (newTranslations: Record<string, string>) => {
	cache = {};
	translations = newTranslations;

	const __ = (
		key: string,
		args?: Record<string, string | number>
	): string => {
		const cacheKey = args ? `${key}:${JSON.stringify(args)}` : key;

		if (cache[cacheKey]) {
			return cache[cacheKey];
		}

		let value = translations[key] || key;

		if (args && _.isString(value)) {
			value = value.replace(/\{\{\s?(\w+)\s?\}\}/g, (sub, param) => {
				return `${!_.isNil(args[param]) ? args[param] : ''}`;
			});

			value = value.replace(/\{\s?(\w+)\s?\}/g, (sub, param) => {
				return `${!_.isNil(args[param]) ? args[param] : ''}`;
			});
		}

		cache[cacheKey] = value;

		return value;
	};

	// @ts-expect-error
	self.__ = __;
};

export default { init };
