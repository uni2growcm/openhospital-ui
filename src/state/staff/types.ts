import type { PageStaffDTO, StaffDTO } from '../../generated';
import type { ApiResponse } from '../types';

export type IStaffState = {
	allStaff: ApiResponse<Array<StaffDTO>>;
	pagedStaff: ApiResponse<PageStaffDTO>;
	create: ApiResponse<StaffDTO>;
	update: ApiResponse<StaffDTO>;
	delete: ApiResponse<boolean>;
};
