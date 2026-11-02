import { ApiResponse } from '../types';
import type { IReportState } from './types';

export const initial: IReportState = {
	statistics: new ApiResponse({ status: 'IDLE', data: [] }),
	print: new ApiResponse({ status: 'IDLE' }),
};
