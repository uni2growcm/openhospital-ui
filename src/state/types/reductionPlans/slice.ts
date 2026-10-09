import { createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { ApiResponse } from '~/state/types';

import { initial } from './initial';
import * as thunks from './thunk';

export const reductionPlanSlice = createSlice({
	name: 'reductionPlans',
	initialState: initial,
	reducers: {},
	extraReducers: (builder) =>
		builder
			// Get Reduction Plans
			.addCase(thunks.getReductionPlans.pending, (state) => {
				state.getAll = ApiResponse.loading();
			})
			.addCase(thunks.getReductionPlans.fulfilled, (state, action) => {
				state.getAll = isEmpty(action.payload)
					? ApiResponse.empty()
					: ApiResponse.value(action.payload);
			})
			.addCase(thunks.getReductionPlans.rejected, (state, action) => {
				state.getAll = ApiResponse.error(action.payload);
			}),
});
