import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import { OthersPriceApi } from '../../generated';
import { customConfiguration } from '../../libraries/apiUtils/configuration';

const api = new OthersPriceApi(customConfiguration());

export const getPricesOthers = createAsyncThunk(
	'pricesOthers/getPricesOthers',
	async (_, thunkApi) =>
		firstValueFrom(wrapper(() => api.getPricesOthers())).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);
