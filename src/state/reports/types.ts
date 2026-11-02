import type { StatisticReportDTO } from '~/generated';
import type { ApiResponse } from '../types';

export type IReportState = {
	statistics: ApiResponse<Array<StatisticReportDTO>>;
	print: ApiResponse<void>;
};
