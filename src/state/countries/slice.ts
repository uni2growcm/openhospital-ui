import { createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { ApiResponse } from '~/state/types';

import { initial } from './initial';
import * as thunks from './thunk';

export const countrySlice = createSlice({
	name: 'countries',
	initialState: initial,
	reducers: {
		createCountryReset: (state) => {
			state.create = initial.create;
		},
		updateCountryReset: (state) => {
			state.update = initial.update;
		},
		deleteCountryReset: (state) => {
			state.delete = initial.delete;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(thunks.getCountries.pending, (state) => {
				state.countryList = ApiResponse.loading();
			})
			.addCase(thunks.getCountries.fulfilled, (state, action) => {
				state.countryList = isEmpty(action.payload)
					? ApiResponse.empty()
					: ApiResponse.value(action.payload);
			})
			.addCase(thunks.getCountries.rejected, (state, action) => {
				state.countryList = ApiResponse.error(action.payload);
			})
			.addCase(thunks.createCountry.pending, (state) => {
				state.create = ApiResponse.loading();
			})
			.addCase(thunks.createCountry.fulfilled, (state, action) => {
				state.create = ApiResponse.value(action.payload);
			})
			.addCase(thunks.createCountry.rejected, (state, action) => {
				state.create = ApiResponse.error(action.payload);
			})
			.addCase(thunks.updateCountry.pending, (state) => {
				state.update = ApiResponse.loading();
			})
			.addCase(thunks.updateCountry.fulfilled, (state, action) => {
				state.update = ApiResponse.value(action.payload);
			})
			.addCase(thunks.updateCountry.rejected, (state, action) => {
				state.update = ApiResponse.error(action.payload);
			})
			.addCase(thunks.deleteCountry.pending, (state) => {
				state.delete = ApiResponse.loading();
			})
			.addCase(thunks.deleteCountry.fulfilled, (state, action) => {
				state.delete = ApiResponse.value(action.payload);
			})
			.addCase(thunks.deleteCountry.rejected, (state, action) => {
				state.delete = ApiResponse.error(action.payload);
			}),
});

export const { createCountryReset, updateCountryReset, deleteCountryReset } =
	countrySlice.actions;
