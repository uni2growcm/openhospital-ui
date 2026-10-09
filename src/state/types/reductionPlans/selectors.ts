import { createSelector } from 'reselect';
import type { IState } from '~/types';

export const selectReductionPlansState = (state: IState) =>
	state.types.reductionPlans;

export const selectGetAllReductionPlansState = createSelector(
	[selectReductionPlansState],
	(reductionPlansState) => reductionPlansState.getAll,
);

export const selectGetAllReductionPlansLoading = createSelector(
	[selectGetAllReductionPlansState],
	(getAllState) => getAllState.isLoading,
);

export const selectGetAllReductionPlansError = createSelector(
	[selectGetAllReductionPlansState],
	(getAllState) => getAllState.error,
);

export const selectReductionPlans = createSelector(
	[selectGetAllReductionPlansState],
	(getAllState) => getAllState.data,
);
