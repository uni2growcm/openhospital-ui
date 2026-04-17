import type { SettingDTO } from '~/generated';
import type { ApiResponse } from '../types';

export type ISettingsState = {
	getAll: ApiResponse<Array<SettingDTO>>;
	getByCode: ApiResponse<SettingDTO>;
	getById: ApiResponse<SettingDTO>;
	update: ApiResponse<SettingDTO>;
	resetAll: ApiResponse<boolean>;
};
