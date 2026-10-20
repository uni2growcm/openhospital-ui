import { ApiResponse } from '../types';
import type { IReductionPlanState } from './types';

export const initial: IReductionPlanState = {
	reductionPlanList: new ApiResponse({ status: 'IDLE', data: [] }),
	selectedReductionPlan: new ApiResponse({ status: 'IDLE' }),
	create: new ApiResponse({ status: 'IDLE' }),
	update: new ApiResponse({ status: 'IDLE' }),
	delete: new ApiResponse({ status: 'IDLE' }),
};
