import 'use-toastr/style.css';
import { Toastr } from 'use-toastr';

import exportComponent from '@/app/libs/export-web-component';

const ToastrContainer = () => {
	return (
		<Toastr
			expand
			richColors
			theme='dark'
		/>
	);
};

export default exportComponent(ToastrContainer);
