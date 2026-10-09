import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import { CountriesApi } from '../../../generated';
import { customConfiguration } from '../../../libraries/apiUtils/configuration';

const api = new CountriesApi(customConfiguration());

export const getCountries = createAsyncThunk(
	'countries/getAll',
	async (_, thunkApi) =>
		firstValueFrom(wrapper(() => api.getCountries())).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);
