import { createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { ApiResponse } from '../types';
import { initial } from './initial';
import {
	createReductionPlan,
	deleteReductionPlan,
	getReductionPlan,
	getReductionPlans,
	updateReductionPlan,
} from './thunk';

export const reductionPlansSlice = createSlice({
	name: 'reductionPlans',
	initialState: initial,
	reducers: {
		createReductionPlanReset: (state) => {
			state.create = initial.create;
		},
		updateReductionPlanReset: (state) => {
			state.update = initial.update;
		},
		deleteReductionPlanReset: (state) => {
			state.delete = initial.delete;
		},
		getReductionPlanReset: (state) => {
			state.selectedReductionPlan = initial.selectedReductionPlan;
		},
	},
	extraReducers: (builder) => {
		builder
			// getReductionPlans
			.addCase(getReductionPlans.pending, (state) => {
				state.reductionPlanList = ApiResponse.loading();
			})
			.addCase(getReductionPlans.fulfilled, (state, action) => {
				state.reductionPlanList = isEmpty(action.payload)
					? ApiResponse.empty()
					: ApiResponse.value(action.payload);
			})
			.addCase(getReductionPlans.rejected, (state, action) => {
				state.reductionPlanList = ApiResponse.error(action.payload as any);
			})
			// getReductionPlan
			.addCase(getReductionPlan.pending, (state) => {
				state.selectedReductionPlan = ApiResponse.loading();
			})
			.addCase(getReductionPlan.fulfilled, (state, action) => {
				state.selectedReductionPlan = ApiResponse.value(action.payload);
			})
			.addCase(getReductionPlan.rejected, (state, action) => {
				state.selectedReductionPlan = ApiResponse.error(action.payload as any);
			})
			// createReductionPlan
			.addCase(createReductionPlan.pending, (state) => {
				state.create = ApiResponse.loading();
			})
			.addCase(createReductionPlan.fulfilled, (state, action) => {
				state.create = ApiResponse.value(action.payload);
			})
			.addCase(createReductionPlan.rejected, (state, action) => {
				state.create = ApiResponse.error(action.payload as any);
			})
			// updateReductionPlan
			.addCase(updateReductionPlan.pending, (state) => {
				state.update = ApiResponse.loading();
			})
			.addCase(updateReductionPlan.fulfilled, (state, action) => {
				state.update = ApiResponse.value(action.payload);
			})
			.addCase(updateReductionPlan.rejected, (state, action) => {
				state.update = ApiResponse.error(action.payload as any);
			})
			// deleteReductionPlan
			.addCase(deleteReductionPlan.pending, (state) => {
				state.delete = ApiResponse.loading();
			})
			.addCase(deleteReductionPlan.fulfilled, (state) => {
				state.delete.status = 'SUCCESS';
			})
			.addCase(deleteReductionPlan.rejected, (state, action) => {
				state.delete = ApiResponse.error(action.payload as any);
			});
	},
});

export const {
	createReductionPlanReset,
	updateReductionPlanReset,
	deleteReductionPlanReset,
	getReductionPlanReset,
} = reductionPlansSlice.actions;

export default reductionPlansSlice.reducer;
