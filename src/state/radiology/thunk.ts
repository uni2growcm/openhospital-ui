import { createAsyncThunk } from '@reduxjs/toolkit';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import { type InstanceResponse, RadiologyApi } from '../../generated';
import { customConfiguration } from '../../libraries/apiUtils/configuration';
import type { SeriesWithInstances } from './types';

const api = new RadiologyApi(customConfiguration());

export const getPatientStudies = createAsyncThunk(
	'radiology/getPatientStudies',
	async (id: string, thunkApi) =>
		wrapper(() => api.getPatientStudiesById({ id }))
			.toPromise()
			.catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const getStudySeries = createAsyncThunk(
	'radiology/getStudySeries',
	async (id: string, thunkApi) =>
		wrapper(() => api.getStudySeriesById({ id }))
			.toPromise()
			.catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const getStudySeriesWithInstances = createAsyncThunk(
	'radiology/getStudySeriesWithInstances',
	async (id: string, thunkApi) =>
		wrapper(() => api.getStudySeriesById({ id }))
			.pipe(
				switchMap((series) =>
					of(
						(async () => {
							const results: SeriesWithInstances[] = [];
							for (const serie of series) {
								let instances: InstanceResponse[] = [];
								try {
									instances =
										(
											await api
												.getSeriesInstancesById({ id: serie.id ?? '' })
												.toPromise()
										)?.sort(
											(a, b) =>
												parseInt(a.instance?.instanceNumber ?? '0', 10) -
												parseInt(b.instance?.instanceNumber ?? '0', 10),
										) ?? [];
								} catch (e) {
									console.log(e);
								} finally {
									results.push({ ...serie, instances });
								}
							}
							return results;
						})(),
					),
				),
			)
			.toPromise()
			.catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const getSerieInstances = createAsyncThunk(
	'radiology/getSerieInstances',
	async (id: string, thunkApi) =>
		wrapper(() => api.getSeriesInstancesById({ id }))
			.toPromise()
			.catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const getInstancePreview = createAsyncThunk(
	'radiology/getInstancePreview',
	async (id: string, thunkApi) =>
		wrapper(() => api.getInstancePreview({ id }))
			.toPromise()
			.catch((error) => thunkApi.rejectWithValue(error.response)),
);
