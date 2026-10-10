import type { CountryDTO } from '../../generated';
import type { ApiResponse } from '../types';

export type ICountryState = {
	countryList: ApiResponse<Array<CountryDTO>>;
	create: ApiResponse<CountryDTO>;
	update: ApiResponse<CountryDTO>;
	delete: ApiResponse<void>;
};
