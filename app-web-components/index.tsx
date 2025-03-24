import r2wc from '@r2wc/react-to-web-component';

import rpc from '@/app-web-components/rpc';
import toastr from '@/app-web-components/toastr';

type WebComponent<T extends (...args: any[]) => any> =
	Parameters<T>[0] extends undefined
		? { slot?: string; children?: React.ReactNode }
		: Parameters<T>[0] & { slot?: string; children?: React.ReactNode };

declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			['x-rpc']: WebComponent<typeof rpc.component>;
			['x-toastr']: WebComponent<typeof toastr.component>;
		}
	}
}

customElements.define('x-rpc', r2wc(rpc.component, rpc));
customElements.define('x-toastr', r2wc(toastr.component, toastr));
