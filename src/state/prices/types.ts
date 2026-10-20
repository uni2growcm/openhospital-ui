import type { PriceDTO } from '~/generated/models/PriceDTO';
import type { PriceListDTO } from '~/generated/models/PriceListDTO';
import type { PricesOthersDTO } from '~/generated/models/PricesOthersDTO';
import type { ApiResponse } from '../types';

export type IPricesState = {
	getPrices: ApiResponse<Array<PriceDTO>>;
	getPriceLists: ApiResponse<Array<PriceListDTO>>;
	getPricesOthers: ApiResponse<Array<PricesOthersDTO>>;
	createPriceList: ApiResponse<PriceListDTO>;
	updatePriceList: ApiResponse<PriceListDTO>;
	deletePriceList: ApiResponse<void>;
};
