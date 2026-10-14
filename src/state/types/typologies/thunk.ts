import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import {
	TypologiesApi,
	type TypologyDTO,
	type GetTypologiesFamilyEnum,
} from '../../../generated';
import { customConfiguration } from '../../../libraries/apiUtils/configuration';

const api = new TypologiesApi(customConfiguration());

export const getTypologies = createAsyncThunk(
	'typologies/getTypologies',
	async (family: GetTypologiesFamilyEnum | undefined, thunkApi) =>
		firstValueFrom(wrapper(() => api.getTypologies({ family }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const getTypologyByCode = createAsyncThunk(
	'typologies/getTypologyByCode',
	async (code: string, thunkApi) =>
		firstValueFrom(wrapper(() => api.getTypologyByCode({ code }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const createTypology = createAsyncThunk(
	'typologies/createTypology',
	async (typologyDTO: TypologyDTO, thunkApi) =>
		firstValueFrom(wrapper(() => api.newTypology({ typologyDTO }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const updateTypology = createAsyncThunk(
	'typologies/updateTypology',
	async (typologyDTO: TypologyDTO, thunkApi) =>
		firstValueFrom(wrapper(() => api.updateTypology({ typologyDTO }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const deleteTypology = createAsyncThunk(
	'typologies/deleteTypology',
	async (code: string, thunkApi) =>
		firstValueFrom(wrapper(() => api.deleteTypology({ code })))
			.then(() => ({ code }))
			.catch((error) => thunkApi.rejectWithValue(error.response)),
);
