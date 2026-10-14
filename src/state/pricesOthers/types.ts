import type { PricesOthersDTO } from '../../generated';
import type { ApiResponse } from '../types';

export type IPricesOthersState = {
	getPricesOthers: ApiResponse<Array<PricesOthersDTO>>;
};
