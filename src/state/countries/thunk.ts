import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import { CountriesApi, type CountryDTO } from '../../generated';
import { customConfiguration } from '../../libraries/apiUtils/configuration';

const api = new CountriesApi(customConfiguration());

export const getCountries = createAsyncThunk(
	'countries/getCountries',
	async (search: string | undefined, thunkApi) =>
		firstValueFrom(wrapper(() => api.getCountries({ search }))).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);

export const createCountry = createAsyncThunk(
	'countries/createCountry',
	async (countryDTO: CountryDTO, thunkApi) =>
		firstValueFrom(wrapper(() => api.createCountry({ countryDTO }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const updateCountry = createAsyncThunk(
	'countries/updateCountry',
	async (
		{ id, countryDTO }: { id: number; countryDTO: CountryDTO },
		thunkApi,
	) =>
		firstValueFrom(wrapper(() => api.updateCountry({ id, countryDTO }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const deleteCountry = createAsyncThunk(
	'countries/deleteCountry',
	async (id: number, thunkApi) =>
		firstValueFrom(wrapper(() => api.deleteCountry({ id }))).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);
