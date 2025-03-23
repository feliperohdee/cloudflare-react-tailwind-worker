import r2wc from '@r2wc/react-to-web-component';

import app from '@/app/components/app';
import hello from '@/app/components/hello';

type WebComponent<T extends (...args: any[]) => any> =
	Parameters<T>[0] extends undefined
		? { slot?: string; children?: React.ReactNode }
		: Parameters<T>[0] & { slot?: string; children?: React.ReactNode };

declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			['x-app']: WebComponent<typeof app.component>;
			['x-hello']: WebComponent<typeof hello.component>;
		}
	}
}

customElements.define('x-app', r2wc(app.component, app));
customElements.define('x-hello', r2wc(hello.component, hello));
