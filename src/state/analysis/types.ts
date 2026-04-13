import type { PatientHistoricResponse } from '~/generated';
import type { ApiResponse } from '../types';

export type IAnalysisState = {
	getPatientAnalysis: ApiResponse<PatientHistoricResponse>;
	printPatientAnalysis: ApiResponse<Blob>;
};
