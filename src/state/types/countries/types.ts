import type { CountryDTO } from '../../../generated';
import type { ApiResponse } from '../../types';

export type ICountriesState = {
	getAll: ApiResponse<Array<CountryDTO>>;
	create: ApiResponse<CountryDTO>;
};
