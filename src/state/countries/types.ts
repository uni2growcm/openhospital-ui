import type { CountryDTO, PageCountryDTO } from '../../generated';
import type { ApiResponse } from '../types';

export type ICountryState = {
	countryList: ApiResponse<Array<CountryDTO>>;
	pagedCountries: ApiResponse<PageCountryDTO>;
	create: ApiResponse<CountryDTO>;
	update: ApiResponse<CountryDTO>;
	delete: ApiResponse<void>;
};
