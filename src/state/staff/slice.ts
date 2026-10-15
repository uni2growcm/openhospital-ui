import { createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { ApiResponse } from '~/state/types';
import { initial } from './initial';
import * as thunks from './thunk';

export const staffSlice = createSlice({
	name: 'staff',
	initialState: initial,
	reducers: {
		createStaffReset: (state) => {
			state.create = initial.create;
		},
		updateStaffReset: (state) => {
			state.update = initial.update;
		},
		deleteStaffReset: (state) => {
			state.delete = initial.delete;
		},
	},
	extraReducers: (builder) =>
		builder
			// Get All Staff
			.addCase(thunks.getStaff.pending, (state) => {
				state.allStaff = ApiResponse.loading();
			})
			.addCase(thunks.getStaff.fulfilled, (state, action) => {
				state.allStaff = isEmpty(action.payload)
					? ApiResponse.empty()
					: ApiResponse.value(action.payload);
			})
			.addCase(thunks.getStaff.rejected, (state, action) => {
				state.allStaff = ApiResponse.error(action.payload);
			})
			// Get Paged Staff
			.addCase(thunks.getStaffPaged.pending, (state) => {
				state.pagedStaff = ApiResponse.loading();
			})
			.addCase(thunks.getStaffPaged.fulfilled, (state, action) => {
				state.pagedStaff = ApiResponse.value(action.payload);
			})
			.addCase(thunks.getStaffPaged.rejected, (state, action) => {
				state.pagedStaff = ApiResponse.error(action.payload);
			})
			// Create Staff
			.addCase(thunks.createStaff.pending, (state) => {
				state.create = ApiResponse.loading();
			})
			.addCase(thunks.createStaff.fulfilled, (state, action) => {
				state.create = ApiResponse.value(action.payload);
			})
			.addCase(thunks.createStaff.rejected, (state, action) => {
				state.create = ApiResponse.error(action.payload);
			})
			// Update Staff
			.addCase(thunks.updateStaff.pending, (state) => {
				state.update = ApiResponse.loading();
			})
			.addCase(thunks.updateStaff.fulfilled, (state, action) => {
				state.update = ApiResponse.value(action.payload);
			})
			.addCase(thunks.updateStaff.rejected, (state, action) => {
				state.update = ApiResponse.error(action.payload);
			})
			// Delete Staff
			.addCase(thunks.deleteStaff.pending, (state) => {
				state.delete = ApiResponse.loading();
			})
			.addCase(thunks.deleteStaff.fulfilled, (state) => {
				state.delete.status = 'SUCCESS';
			})
			.addCase(thunks.deleteStaff.rejected, (state, action) => {
				state.delete = ApiResponse.error(action.payload);
			}),
});

export const { createStaffReset, updateStaffReset, deleteStaffReset } =
	staffSlice.actions;
