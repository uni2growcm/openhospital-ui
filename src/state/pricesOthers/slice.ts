import { createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { ApiResponse } from '~/state/types';
import { initial } from './initial';
import * as thunks from './thunk';

export const pricesOthersSlice = createSlice({
	name: 'pricesOthers',
	initialState: initial,
	reducers: {},
	extraReducers: (builder) =>
		builder
			.addCase(thunks.getPricesOthers.pending, (state) => {
				state.getPricesOthers = ApiResponse.loading();
			})
			.addCase(thunks.getPricesOthers.fulfilled, (state, action) => {
				state.getPricesOthers = isEmpty(action.payload)
					? ApiResponse.empty()
					: ApiResponse.value(action.payload);
			})
			.addCase(thunks.getPricesOthers.rejected, (state, action) => {
				state.getPricesOthers = ApiResponse.error(action.payload);
			}),
});
