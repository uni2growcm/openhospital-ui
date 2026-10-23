import { ApiResponse } from '../../types';
import type { ITypologiesState } from './types';

export const initial: ITypologiesState = {
	getTypologies: new ApiResponse({ status: 'IDLE', data: [] }),
	getTypology: new ApiResponse({ status: 'IDLE' }),
	create: new ApiResponse({ status: 'IDLE' }),
	update: new ApiResponse({ status: 'IDLE' }),
	delete: new ApiResponse({ status: 'IDLE' }),
};
