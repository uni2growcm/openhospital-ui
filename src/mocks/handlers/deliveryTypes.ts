import { HttpResponse } from 'msw';
import { deliveryTypesDTO } from '../fixtures/deliveryTypesDTO';
import { badRequest, http } from '../utils';

type DeliveryTypeBody = {
	code?: string;
};

export const deliveryTypes = [
	http.get('/deliverytypes', () => {
		return HttpResponse.json(deliveryTypesDTO, { status: 200 });
	}),

	http.post('/deliverytypes', async ({ request }) => {
		const body = (await request.json()) as DeliveryTypeBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create delivery type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/deliverytypes', async ({ request }) => {
		const body = (await request.json()) as DeliveryTypeBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update delivery type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/deliverytypes/{code}', ({ params }) => {
		if (params.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete delivery type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),
];
