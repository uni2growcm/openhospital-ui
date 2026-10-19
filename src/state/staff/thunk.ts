import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import { StaffApi, type StaffDTO } from '../../generated';
import { customConfiguration } from '../../libraries/apiUtils/configuration';

const api = new StaffApi(customConfiguration());

export const getStaff = createAsyncThunk(
	'staff/getStaff',
	async (_, thunkApi) =>
		firstValueFrom(wrapper(() => api.getStaff())).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);

export const getStaffPaged = createAsyncThunk(
	'staff/getStaffPaged',
	async (
		{ page, size, keyword }: { page?: number; size?: number; keyword?: string },
		thunkApi,
	) =>
		firstValueFrom(
			wrapper(() =>
				api.getStaffPaged({
					page: page ?? 0,
					size: size ?? 10,
					keyword,
				}),
			),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const createStaff = createAsyncThunk(
	'staff/createStaff',
	async (staffDTO: StaffDTO, thunkApi) =>
		firstValueFrom(wrapper(() => api.newStaff({ staffDTO }))).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);

export const updateStaff = createAsyncThunk(
	'staff/updateStaff',
	async (staffDTO: StaffDTO, thunkApi) =>
		firstValueFrom(wrapper(() => api.updateStaff({ staffDTO }))).catch(
			(error) => thunkApi.rejectWithValue(error.response),
		),
);

export const deleteStaff = createAsyncThunk(
	'staff/deleteStaff',
	async (code: number, thunkApi) =>
		firstValueFrom(wrapper(() => api.deleteStaff({ code }))).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);
