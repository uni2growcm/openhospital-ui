import { ApiResponse } from '../types';
import type { IPricesOthersState } from './types';

export const initial: IPricesOthersState = {
	getPricesOthers: new ApiResponse({ status: 'IDLE', data: [] }),
};
