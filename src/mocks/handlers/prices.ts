import { HttpResponse } from 'msw';
import { priceDTO } from '../fixtures/priceDTO';
import { priceListDTO } from '../fixtures/priceListDTO';
import { pricesOthersDTO } from '../fixtures/pricesOthersDTO';
import { badRequest, http } from '../utils';

export const prices = [
	http.get('/pricelists/prices', () => {
		return HttpResponse.json(priceDTO, { status: 200 });
	}),

	http.get('/pricelists', () => {
		return HttpResponse.json(priceListDTO, { status: 200 });
	}),

	http.post('/pricelists', async ({ request }) => {
		const body = await request.json();
		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/pricelists/{id}', async ({ params, request }) => {
		if (params.id === '-1') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update price list' }),
				{ status: 400 },
			);
		}

		const body = await request.json();
		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/pricelists/{id}', ({ params }) => {
		if (params.id === '-1') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete price list' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),

	http.put('/pricelists/{id}/prices', ({ params }) => {
		if (params.id === '-1') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update prices' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),

	http.get('/pricelists/duplicate/byfactor/{id}', ({ params }) => {
		if (params.id === '-1') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to duplicate price list' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),

	http.get('/pricelists/duplicate/{id}', ({ params }) => {
		if (params.id === '-1') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to duplicate price list' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),

	http.get('/pricesothers', () => {
		return HttpResponse.json(pricesOthersDTO, { status: 200 });
	}),
];
