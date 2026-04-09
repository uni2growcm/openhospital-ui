import { createSelector } from 'reselect';
import type { IState } from '~/types';

export const selectAnalysisState = (state: IState) => state.analysis;

export const selectGetAnalysisState = createSelector(
	[selectAnalysisState],
	(analysisState) => analysisState.getPatientAnalysis,
);

export const selectGetAnalysisLoading = createSelector(
	[selectGetAnalysisState],
	(getState) => getState.isLoading,
);

export const selectGetAnalysisError = createSelector(
	[selectGetAnalysisState],
	(getState) => getState.error,
);