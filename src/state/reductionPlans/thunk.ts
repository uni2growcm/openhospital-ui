import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import { type ReductionPlanDTO, ReductionPlansApi } from '../../generated';
import { customConfiguration } from '../../libraries/apiUtils/configuration';

const api = new ReductionPlansApi(customConfiguration());

export const getReductionPlans = createAsyncThunk(
	'reductionPlans/getReductionPlans',
	async (q: string | undefined, thunkApi) =>
		firstValueFrom(wrapper(() => api.getReductionPlans({ q }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const getReductionPlan = createAsyncThunk(
	'reductionPlans/getReductionPlan',
	async (id: number, thunkApi) =>
		firstValueFrom(wrapper(() => api.getReductionPlan({ id }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const createReductionPlan = createAsyncThunk(
	'reductionPlans/createReductionPlan',
	async (reductionPlanDTO: ReductionPlanDTO, thunkApi) =>
		firstValueFrom(wrapper(() => api.createReductionPlan({ reductionPlanDTO }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const updateReductionPlan = createAsyncThunk(
	'reductionPlans/updateReductionPlan',
	async (reductionPlanDTO: ReductionPlanDTO, thunkApi) => {
		if (reductionPlanDTO.id == null) {
			return thunkApi.rejectWithValue({ message: 'Missing reduction plan ID' });
		}
		const id = reductionPlanDTO.id;
		try {
			return await firstValueFrom(
				wrapper(() =>
					api.updateReductionPlan({
						id,
						reductionPlanDTO,
					}),
				),
			);
		} catch (error: any) {
			return thunkApi.rejectWithValue(error.response ?? error);
		}
	},
);

export const deleteReductionPlan = createAsyncThunk(
	'reductionPlans/deleteReductionPlan',
	async (id: number, thunkApi) =>
		firstValueFrom(wrapper(() => api.deleteReductionPlan({ id }))).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);
