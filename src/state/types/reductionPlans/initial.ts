import { ApiResponse } from '../../types';
import type { IReductionPlansState } from './types';

export const initial: IReductionPlansState = {
	getAll: new ApiResponse({ status: 'IDLE', data: [] }),
};
