import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import { ArticleFamiliesApi, type ArticleFamilyDTO } from '../../generated';
import { customConfiguration } from '../../libraries/apiUtils/configuration';

const api = new ArticleFamiliesApi(customConfiguration());

export const getArticleFamilies = createAsyncThunk(
	'articleFamilies/getArticleFamilies',
	async (search: string | undefined, thunkApi) => {
		const request = search?.trim()
			? () => api.searchArticleFamilies({ q: search.trim() })
			: () => api.getAllArticleFamilies();
		return firstValueFrom(wrapper(request)).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		);
	},
);

export const createArticleFamily = createAsyncThunk(
	'articleFamilies/createArticleFamily',
	async (articleFamilyDTO: ArticleFamilyDTO, thunkApi) =>
		firstValueFrom(
			wrapper(() => api.createArticleFamily({ articleFamilyDTO })),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const updateArticleFamily = createAsyncThunk(
	'articleFamilies/updateArticleFamily',
	async (
		{
			id,
			articleFamilyDTO,
		}: { id: number; articleFamilyDTO: ArticleFamilyDTO },
		thunkApi,
	) =>
		firstValueFrom(
			wrapper(() => api.updateArticleFamily({ id, articleFamilyDTO })),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const deleteArticleFamily = createAsyncThunk(
	'articleFamilies/deleteArticleFamily',
	async (id: number, thunkApi) =>
		firstValueFrom(wrapper(() => api.deleteArticleFamily({ id }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);
