import { createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { ApiResponse } from '../types';
import { initial } from './initial';
import * as thunks from './thunk';

export const reportSlice = createSlice({
	name: 'reports',
	initialState: initial,
	reducers: {
		printReportReset: (state) => {
			state.print = initial.print;
		},
	},
	extraReducers: (builder) =>
		builder
			// Get statistic reports
			.addCase(thunks.getStatisticReports.pending, (state) => {
				state.statistics = ApiResponse.loading();
			})
			.addCase(thunks.getStatisticReports.fulfilled, (state, action) => {
				state.statistics = isEmpty(action.payload)
					? ApiResponse.empty()
					: ApiResponse.value(action.payload);
			})
			.addCase(thunks.getStatisticReports.rejected, (state, action) => {
				state.statistics = ApiResponse.error(action.payload);
			})
			// Print a report (the file itself is not kept in the store)
			.addCase(thunks.printReport.pending, (state) => {
				state.print = ApiResponse.loading();
			})
			.addCase(thunks.printReport.fulfilled, (state) => {
				state.print = ApiResponse.value(undefined);
			})
			.addCase(thunks.printReport.rejected, (state, action) => {
				state.print = ApiResponse.error(action.payload);
			}),
});

export const { printReportReset } = reportSlice.actions;
