import type { LabbookPatientHistoricDTO } from '~/generated';
import type { ApiResponse } from '../types';

export type IAnalysisState = {
	getPatientAnalysis: ApiResponse<LabbookPatientHistoricDTO>;
	printPatientAnalysis: ApiResponse<Blob>;
};
