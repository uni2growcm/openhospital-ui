import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom, type Observable } from 'rxjs';
import { ReportsApi } from '~/generated';
import { customConfiguration } from '~/libraries/apiUtils/configuration';
import { wrapper } from '~/libraries/apiUtils/wrapper';

export const reportsApi = new ReportsApi(customConfiguration());

/**
 * Report errors come back as a Blob (the request expects a binary response):
 * read it to get the message sent by the API.
 */
const readError = async (error: any) => {
	const response = error?.response;
	if (response instanceof Blob) {
		try {
			return JSON.parse(await response.text());
		} catch {
			return { message: undefined };
		}
	}
	return response ?? { message: undefined };
};

export const getStatisticReports = createAsyncThunk(
	'reports/getStatisticReports',
	async (lang: string | undefined, thunkApi) =>
		firstValueFrom(
			wrapper(() => reportsApi.getStatisticReports({ lang })),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const printReport = createAsyncThunk(
	'reports/printReport',
	async (request: () => Observable<Blob>, thunkApi) =>
		firstValueFrom(wrapper(request)).catch(async (error) =>
			thunkApi.rejectWithValue(await readError(error)),
		),
);
