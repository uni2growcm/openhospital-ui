import type { PagePatientDTO, PatientDTO } from '../../generated';
import type { ApiResponse } from '../types';

export type IPatientsState = {
	createPatient: ApiResponse<PatientDTO>;
	searchResults: ApiResponse<Array<PatientDTO> | PagePatientDTO>;
	selectedPatient: ApiResponse<PatientDTO>;
	updatePatient: ApiResponse<PatientDTO>;
	getCities: ApiResponse<Array<string>>;
	getPatients: ApiResponse<PagePatientDTO>;
};
