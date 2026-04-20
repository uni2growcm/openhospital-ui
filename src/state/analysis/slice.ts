import { createSlice } from '@reduxjs/toolkit';
import { ApiResponse } from '../types';
import { initial } from './initial';
import * as thunks from './thunk';

export const analysisSlice = createSlice({
	name: 'analysis',
	initialState: initial,
	reducers: {
		getPatientAnalysisReset: (state) => {
			state.getPatientAnalysis = initial.getPatientAnalysis;
		},
		printPatientAnalysisReset: (state) => {
			state.printPatientAnalysis = initial.printPatientAnalysis;
		},
	},
	extraReducers: (builder) =>
		builder
			// Get Patient Analysis
			.addCase(thunks.getPatientAnalysis.pending, (state) => {
				state.getPatientAnalysis = ApiResponse.loading();
			})
			.addCase(thunks.getPatientAnalysis.fulfilled, (state, action) => {
				state.getPatientAnalysis = ApiResponse.value(action.payload);
			})
			.addCase(thunks.getPatientAnalysis.rejected, (state, action) => {
				state.getPatientAnalysis = ApiResponse.error(action.payload);
			})
			// Print Patient Analysis
			.addCase(thunks.printPatientAnalysis.pending, (state) => {
				state.printPatientAnalysis = ApiResponse.loading();
			})
			.addCase(thunks.printPatientAnalysis.fulfilled, (state, action) => {
				state.printPatientAnalysis = ApiResponse.value(action.payload);
			})
			.addCase(thunks.printPatientAnalysis.rejected, (state, action) => {
				state.printPatientAnalysis = ApiResponse.error(action.payload);
			}),
});

export const { getPatientAnalysisReset, printPatientAnalysisReset } =
	analysisSlice.actions;
