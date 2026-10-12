import { ApiResponse } from '../types';
import type { IStaffState } from './types';

export const initial: IStaffState = {
	allStaff: new ApiResponse({ status: 'IDLE', data: [] }),
	pagedStaff: new ApiResponse({ status: 'IDLE' }),
	create: new ApiResponse({ status: 'IDLE' }),
	update: new ApiResponse({ status: 'IDLE' }),
	delete: new ApiResponse({ status: 'IDLE' }),
};
