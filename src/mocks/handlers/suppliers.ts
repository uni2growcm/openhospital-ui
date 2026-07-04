import { HttpResponse } from 'msw';
import { supplierDTO } from '../fixtures/supplierDTO';
import { badRequest, http } from '../utils';

type SupplierBody = {
	supId?: number | string;
};

export const suppliers = [
	http.get('/suppliers', () => {
		return HttpResponse.json(supplierDTO, { status: 200 });
	}),

	http.post('/suppliers', async ({ request }) => {
		const body = (await request.json()) as SupplierBody | null;

		if (body?.supId?.toString() === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create supplier' }),
				{ status: 400 },
			);
		}

		const result = { ...body, supId: 100 };
		return HttpResponse.json(result, { status: 201 });
	}),

	http.put('/suppliers', async ({ request }) => {
		const body = (await request.json()) as SupplierBody | null;

		if (body?.supId?.toString() === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update supplier' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),
];
