import type {
	InstanceResponse,
	SeriesResponse,
	StudyResponse,
} from '../../generated';
import type { ApiResponse } from '../types';

export interface SeriesWithInstances extends SeriesResponse {
	instances: InstanceResponse[];
}

export type IRadiologyState = {
	studies: ApiResponse<StudyResponse[]>;
	series: ApiResponse<SeriesResponse[]>;
	seriesWithInstances: ApiResponse<SeriesWithInstances[]>;
	instances: ApiResponse<InstanceResponse[]>;
	preview: ApiResponse<string>;
};
