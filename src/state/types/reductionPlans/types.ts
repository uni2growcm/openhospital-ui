import type { ReductionPlanDTO } from '../../../generated';
import type { ApiResponse } from '../../types';

export type IReductionPlansState = {
	getAll: ApiResponse<Array<ReductionPlanDTO>>;
};
