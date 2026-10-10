import { ApiResponse } from '../../types';
import type { ICountriesState } from './types';

export const initial: ICountriesState = {
	getAll: new ApiResponse({ status: 'IDLE', data: [] }),
	create: new ApiResponse({ status: 'IDLE' }),
};
