import { createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { ApiResponse } from '~/state/types';
import { initial } from './initial';
import * as thunks from './thunk';

export const typologySlice = createSlice({
	name: 'typologies',
	initialState: initial,
	reducers: {
		createTypologyReset: (state) => {
			state.create = initial.create;
		},
		updateTypologyReset: (state) => {
			state.update = initial.update;
		},
		deleteTypologyReset: (state) => {
			state.delete = initial.delete;
		},
		getTypologyReset: (state) => {
			state.getTypology = initial.getTypology;
		},
	},
	extraReducers: (builder) =>
		builder
			// Get Typologies
			.addCase(thunks.getTypologies.pending, (state) => {
				state.getTypologies = ApiResponse.loading();
			})
			.addCase(thunks.getTypologies.fulfilled, (state, action) => {
				state.getTypologies = isEmpty(action.payload)
					? ApiResponse.empty()
					: ApiResponse.value(action.payload);
			})
			.addCase(thunks.getTypologies.rejected, (state, action) => {
				state.getTypologies = ApiResponse.error(action.payload);
			})
			// Get Typology by code
			.addCase(thunks.getTypologyByCode.pending, (state) => {
				state.getTypology = ApiResponse.loading();
			})
			.addCase(thunks.getTypologyByCode.fulfilled, (state, action) => {
				state.getTypology = ApiResponse.value(action.payload);
			})
			.addCase(thunks.getTypologyByCode.rejected, (state, action) => {
				state.getTypology = ApiResponse.error(action.payload);
			})
			// Create Typology
			.addCase(thunks.createTypology.pending, (state) => {
				state.create = ApiResponse.loading();
			})
			.addCase(thunks.createTypology.fulfilled, (state, action) => {
				state.create = ApiResponse.value(action.payload);
			})
			.addCase(thunks.createTypology.rejected, (state, action) => {
				state.create = ApiResponse.error(action.payload);
			})
			// Update Typology
			.addCase(thunks.updateTypology.pending, (state) => {
				state.update = ApiResponse.loading();
			})
			.addCase(thunks.updateTypology.fulfilled, (state, action) => {
				state.update = ApiResponse.value(action.payload);
			})
			.addCase(thunks.updateTypology.rejected, (state, action) => {
				state.update = ApiResponse.error(action.payload);
			})
			// Delete Typology
			.addCase(thunks.deleteTypology.pending, (state) => {
				state.delete = ApiResponse.loading();
			})
			.addCase(thunks.deleteTypology.fulfilled, (state, action) => {
				state.delete.status = 'SUCCESS';
				state.getTypologies.data = state.getTypologies.data?.filter((e) => {
					return e.code !== action.payload.code;
				});
				if (state.getTypologies.data?.length === 0) {
					state.getTypologies.status = 'SUCCESS_EMPTY';
				}
			})
			.addCase(thunks.deleteTypology.rejected, (state, action) => {
				state.delete = ApiResponse.error(action.payload);
			}),
});

export const {
	createTypologyReset,
	updateTypologyReset,
	deleteTypologyReset,
	getTypologyReset,
} = typologySlice.actions;
