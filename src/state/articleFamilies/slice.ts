import { createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { ApiResponse } from '~/state/types';

import { initial } from './initial';
import * as thunks from './thunk';

export const articleFamilySlice = createSlice({
	name: 'articleFamilies',
	initialState: initial,
	reducers: {
		createArticleFamilyReset: (state) => {
			state.create = initial.create;
		},
		updateArticleFamilyReset: (state) => {
			state.update = initial.update;
		},
		deleteArticleFamilyReset: (state) => {
			state.delete = initial.delete;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(thunks.getArticleFamilies.pending, (state) => {
				state.articleFamilyList = ApiResponse.loading();
			})
			.addCase(thunks.getArticleFamilies.fulfilled, (state, action) => {
				state.articleFamilyList = isEmpty(action.payload)
					? ApiResponse.empty()
					: ApiResponse.value(action.payload);
			})
			.addCase(thunks.getArticleFamilies.rejected, (state, action) => {
				state.articleFamilyList = ApiResponse.error(action.payload);
			})
			.addCase(thunks.createArticleFamily.pending, (state) => {
				state.create = ApiResponse.loading();
			})
			.addCase(thunks.createArticleFamily.fulfilled, (state, action) => {
				state.create = ApiResponse.value(action.payload);
			})
			.addCase(thunks.createArticleFamily.rejected, (state, action) => {
				state.create = ApiResponse.error(action.payload);
			})
			.addCase(thunks.updateArticleFamily.pending, (state) => {
				state.update = ApiResponse.loading();
			})
			.addCase(thunks.updateArticleFamily.fulfilled, (state, action) => {
				state.update = ApiResponse.value(action.payload);
			})
			.addCase(thunks.updateArticleFamily.rejected, (state, action) => {
				state.update = ApiResponse.error(action.payload);
			})
			.addCase(thunks.deleteArticleFamily.pending, (state) => {
				state.delete = ApiResponse.loading();
			})
			.addCase(thunks.deleteArticleFamily.fulfilled, (state, action) => {
				state.delete = ApiResponse.value(action.payload);
			})
			.addCase(thunks.deleteArticleFamily.rejected, (state, action) => {
				state.delete = ApiResponse.error(action.payload);
			}),
});

export const {
	createArticleFamilyReset,
	updateArticleFamilyReset,
	deleteArticleFamilyReset,
} = articleFamilySlice.actions;
