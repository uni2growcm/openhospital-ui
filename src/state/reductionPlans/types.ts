import type { ReductionPlanDTO } from '../../generated';
import type { ApiResponse } from '../types';

export type IReductionPlanState = {
	reductionPlanList: ApiResponse<Array<ReductionPlanDTO>>;
	selectedReductionPlan: ApiResponse<ReductionPlanDTO>;
	create: ApiResponse<ReductionPlanDTO>;
	update: ApiResponse<ReductionPlanDTO>;
	delete: ApiResponse<void>;
};
