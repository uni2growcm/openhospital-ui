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
	},
	extraReducers: (builder) =>
		builder
			// Get Countries
			.addCase(thunks.getCountries.pending, (state) => {
				state.getAll = ApiResponse.loading();
			})
			.addCase(thunks.getCountries.fulfilled, (state, action) => {
				state.getAll = isEmpty(action.payload)
					? ApiResponse.empty()
					: ApiResponse.value(action.payload);
			})
			.addCase(thunks.getCountries.rejected, (state, action) => {
				state.getAll = ApiResponse.error(action.payload);
			})
			// Create Country
			.addCase(thunks.createCountry.pending, (state) => {
				state.create = ApiResponse.loading();
			})
			.addCase(thunks.createCountry.fulfilled, (state, action) => {
				state.create = ApiResponse.value(action.payload);
			})
			.addCase(thunks.createCountry.rejected, (state, action) => {
				state.create = ApiResponse.error(action.payload);
			}),
});

export const { createCountryReset } = countrySlice.actions;
