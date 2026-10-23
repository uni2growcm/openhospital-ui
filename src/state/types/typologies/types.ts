import type { TypologyDTO } from '../../../generated';
import type { ApiResponse } from '../../types';

export type ITypologiesState = {
	getTypologies: ApiResponse<Array<TypologyDTO>>;
	getTypology: ApiResponse<TypologyDTO>;
	create: ApiResponse<TypologyDTO>;
	update: ApiResponse<TypologyDTO>;
	delete: ApiResponse<boolean>;
};
