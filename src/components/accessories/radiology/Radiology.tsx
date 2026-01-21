import 'moment/min/locales';
import { Outlet } from 'react-router';

export const Radiology = () => {
	return (
		<div className="radiology">
			<Outlet />
		</div>
	);
};
