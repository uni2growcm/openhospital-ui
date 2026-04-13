import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import {
	type GetPatientAnalysisRequest,
	LabbookApi,
	type ReportGroupedRequest,
} from '~/generated';
import { customConfiguration } from '~/libraries/apiUtils/configuration';
import { wrapper } from '~/libraries/apiUtils/wrapper';

const apiAnalysis = new LabbookApi(customConfiguration());

export const getPatientAnalysis = createAsyncThunk(
	'labbook/PatientAnalysis',
	async (payload: GetPatientAnalysisRequest, thunkApi) =>
		firstValueFrom(
			wrapper(() =>
				apiAnalysis.getPatientAnalysis({
					id: payload.id,
				}),
			),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const printPatientAnalysis = createAsyncThunk<
	Blob,
	ReportGroupedRequest,
	{ rejectValue: any }
>(
	'labbok/PrintPatientAnalysis',
	async (reportGroupedRequest: ReportGroupedRequest, thunkApi) => {
		try {
			const response = await firstValueFrom(
				wrapper(() =>
					apiAnalysis.generateReportGrouped({ reportGroupedRequest }),
				),
			);

			return response as unknown as Blob;
		} catch (error: any) {
			return thunkApi.rejectWithValue(
				error?.response ?? { message: 'Failed to print patient analysis' },
			);
		}
	},
);
