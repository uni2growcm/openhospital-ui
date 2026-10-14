import { createSelector } from 'reselect';
import type { IState } from '~/types';

export const selectStaffState = (state: IState) => state.staff;

export const selectAllStaffState = createSelector(
	[selectStaffState],
	(staffState) => staffState.allStaff,
);

export const selectAllStaffLoading = createSelector(
	[selectAllStaffState],
	(allState) => allState.isLoading,
);

export const selectAllStaffError = createSelector(
	[selectAllStaffState],
	(allState) => allState.error,
);

export const selectAllStaff = createSelector(
	[selectAllStaffState],
	(allState) => allState.data,
);

export const selectPagedStaffState = createSelector(
	[selectStaffState],
	(staffState) => staffState.pagedStaff,
);

export const selectPagedStaffLoading = createSelector(
	[selectPagedStaffState],
	(pagedState) => pagedState.isLoading,
);

export const selectPagedStaffError = createSelector(
	[selectPagedStaffState],
	(pagedState) => pagedState.error,
);

export const selectCreateStaffState = createSelector(
	[selectStaffState],
	(staffState) => staffState.create,
);

export const selectCreateStaffLoading = createSelector(
	[selectCreateStaffState],
	(createState) => createState.isLoading,
);

export const selectCreateStaffError = createSelector(
	[selectCreateStaffState],
	(createState) => createState.error,
);

export const selectUpdateStaffState = createSelector(
	[selectStaffState],
	(staffState) => staffState.update,
);

export const selectUpdateStaffLoading = createSelector(
	[selectUpdateStaffState],
	(updateState) => updateState.isLoading,
);

export const selectUpdateStaffError = createSelector(
	[selectUpdateStaffState],
	(updateState) => updateState.error,
);

export const selectDeleteStaffState = createSelector(
	[selectStaffState],
	(staffState) => staffState.delete,
);

export const selectDeleteStaffLoading = createSelector(
	[selectDeleteStaffState],
	(deleteState) => deleteState.isLoading,
);

export const selectDeleteStaffError = createSelector(
	[selectDeleteStaffState],
	(deleteState) => deleteState.error,
);
