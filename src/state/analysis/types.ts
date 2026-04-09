import { AnalysisDTO } from '~/mocks/fixtures/analysisDTO';
import type { ApiResponse } from '../types';

export type IAnalysisState = {
	getPatientAnalysis: ApiResponse<AnalysisDTO>;
};
