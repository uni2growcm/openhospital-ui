import { HttpResponse } from 'msw';
import { priceDTO } from '../fixtures/priceDTO';
import { http } from '../utils';

export const prices = [
	http.get('/pricelists/prices', () => {
		return HttpResponse.json(priceDTO, { status: 200 });
	}),
];
