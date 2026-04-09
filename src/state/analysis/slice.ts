import { createSlice } from '@reduxjs/toolkit';
import { initial } from './initial';

export const analysisSlice = createSlice({
	name: 'analysis',
	initialState: initial,
	reducers: {
		getPatientAnalysisReset: (state) => {
			state.getPatientAnalysis = initial.getPatientAnalysis;
		},
	},
	extraReducers: (builder) => builder,
	// Get Patient Analysis
	// .addCase(thunks.getPatientAnalysis.pending, (state) => {
	// 	state.getPatientAnalysis = ApiResponse.loading();
	// })
	// .addCase(thunks.getPatientAnalysis.fulfilled, (state, action) => {
	// 	state.getPatientAnalysis.status = isEmpty(action.payload?.data)
	// 		? 'SUCCESS_EMPTY'
	// 		: 'SUCCESS';
	// 	state.getPatientAnalysis.data = action.payload;
	// })
	// .addCase(thunks.getPatientAnalysis.rejected, (state, action) => {
	// 	state.getPatientAnalysis = ApiResponse.error(action.payload);
	// }),
});

export const { getPatientAnalysisReset } = analysisSlice.actions;
