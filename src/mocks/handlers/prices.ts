import { HttpResponse } from 'msw';
import { priceDTO } from '../fixtures/priceDTO';
import { pricesOthersDTO } from '../fixtures/pricesOthersDTO';
import { http } from '../utils';

export const prices = [
	http.get('/pricelists/prices', () => {
		return HttpResponse.json(priceDTO, { status: 200 });
	}),

	http.get('/pricesothers', () => {
		return HttpResponse.json(pricesOthersDTO, { status: 200 });
	}),
];
