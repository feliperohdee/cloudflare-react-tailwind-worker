import enUS from '@/i18n/en-us.json';
import loader from '@/i18n/loader';

const i18n = {
	'en-us': enUS
};

const init = (lang: SupportedLang) => {
	loader.init(i18n[lang]);
};

const supports = (lang: string): lang is SupportedLang => {
	return lang in i18n;
};

type SupportedLang = keyof typeof i18n;

export type { SupportedLang };
export default { init, supports };
