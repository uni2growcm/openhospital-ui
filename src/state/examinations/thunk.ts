import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import {
	ExaminationsApi,
	type PatientExaminationDTO,
	ReportsApi,
} from '../../generated';
import { customConfiguration } from '../../libraries/apiUtils/configuration';

const api = new ExaminationsApi(customConfiguration());
const apiReport = new ReportsApi(customConfiguration());

export const examinationsByPatientId = createAsyncThunk(
	'examinations/examinationsByPatientId',
	async (patId: number | undefined, thunkApi) =>
		firstValueFrom(
			wrapper(() => api.getByPatientId({ patId: patId ?? -1 })),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const getDefaultPatientExamination = createAsyncThunk(
	'examinations/getDefaultPatientExamination',
	async (patId: number, thunkApi) =>
		firstValueFrom(
			wrapper(() => api.getDefaultPatientExamination({ patId })),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const getLastByPatientId = createAsyncThunk(
	'examinations/getLastByPatientId',
	async (patId: number, thunkApi) =>
		firstValueFrom(wrapper(() => api.getLastByPatientId({ patId }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const createExamination = createAsyncThunk(
	'examinations/createExamination',
	async (patientExaminationDTO: PatientExaminationDTO, thunkApi) =>
		firstValueFrom(
			wrapper(() => api.newPatientExamination({ patientExaminationDTO })),
		)
			.then(() => patientExaminationDTO)
			.catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const updateExamination = createAsyncThunk(
	'examinations/updateExamination',
	async (
		payload: { id: number; patientExaminationDTO: PatientExaminationDTO },
		thunkApi,
	) =>
		firstValueFrom(wrapper(() => api.updateExamination(payload)))
			.then(() => ({ ...payload.patientExaminationDTO, id: payload.id }))
			.catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const deleteExamination = createAsyncThunk(
	'examinations/deleteExamination',
	async (_id: number, thunkApi) =>
		thunkApi.rejectWithValue({ message: 'Delete api not yet available !!!' }),
);

export const printExamination = createAsyncThunk<
	Blob,
	number,
	{ rejectValue: any }
>('reports/patientexamination', async (examinationId, thunkApi) => {
	try {
		const response = await firstValueFrom(
			wrapper(() => apiReport.printPatientExaminationPdf({ examinationId })),
		);

		return response as unknown as Blob;
	} catch (error: any) {
		return thunkApi.rejectWithValue(
			error?.response ?? { message: 'Failed to print examination' },
		);
	}
});
