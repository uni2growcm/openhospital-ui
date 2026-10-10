import { ApiResponse } from '../types';
import type { ICountryState } from './types';

export const initial: ICountryState = {
	create: new ApiResponse({ status: 'IDLE' }),
	update: new ApiResponse({ status: 'IDLE' }),
	delete: new ApiResponse({ status: 'IDLE' }),
	countryList: new ApiResponse({
		status: 'IDLE',
		data: [],
	}),
};
