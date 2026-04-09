import { ApiResponse } from '../types';
import type { IAnalysisState } from './types';

export const initial: IAnalysisState = {
	getPatientAnalysis: new ApiResponse({ status: 'IDLE' }),
};
