import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import { ReductionPlansApi } from '../../../generated';
import { customConfiguration } from '../../../libraries/apiUtils/configuration';

const api = new ReductionPlansApi(customConfiguration());

export const getReductionPlans = createAsyncThunk(
	'reductionPlans/getAll',
	async (_, thunkApi) =>
		firstValueFrom(wrapper(() => api.getReductionPlans({}))).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);
