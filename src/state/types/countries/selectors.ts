import { createSelector } from 'reselect';
import type { IState } from '~/types';

export const selectCountriesState = (state: IState) => state.types.countries;

export const selectGetAllCountriesState = createSelector(
	[selectCountriesState],
	(countriesState) => countriesState.getAll,
);

export const selectGetAllCountriesLoading = createSelector(
	[selectGetAllCountriesState],
	(getAllState) => getAllState.isLoading,
);

export const selectGetAllCountriesError = createSelector(
	[selectGetAllCountriesState],
	(getAllState) => getAllState.error,
);

export const selectCountries = createSelector(
	[selectGetAllCountriesState],
	(getAllState) => getAllState.data,
);
