import { ApiResponse } from '../types';
import type { IArticleFamilyState } from './types';

export const initial: IArticleFamilyState = {
	create: new ApiResponse({ status: 'IDLE' }),
	update: new ApiResponse({ status: 'IDLE' }),
	delete: new ApiResponse({ status: 'IDLE' }),
	articleFamilyList: new ApiResponse({
		status: 'IDLE',
		data: [],
	}),
};
