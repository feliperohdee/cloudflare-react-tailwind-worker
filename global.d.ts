declare const __: (key: string, args?: Record<string | number>) => string;

declare module '*.md' {
	const content: string;
	export default content;
}
