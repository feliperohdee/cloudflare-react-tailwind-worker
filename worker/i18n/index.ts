import enUS from '@/worker/i18n/en-us.json';
import handler from '@/worker/i18n/handler';

const i18n = {
	'en-us': enUS
};

const init = (lang: keyof typeof i18n) => {
	handler(i18n[lang]);
};

const supports = (lang: string): lang is keyof typeof i18n => {
	return lang in i18n;
};

export default { init, supports };
