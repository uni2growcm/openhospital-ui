import { HttpResponse } from 'msw';
import { deliveryResultTypeDTO } from '../fixtures/deliveryResultTypeDTO';
import { badRequest, http } from '../utils';

type DeliveryResultTypeBody = {
	code?: string;
};

export const deliveryResultTypes = [
	http.get('/deliveryresulttypes', () => {
		return HttpResponse.json(deliveryResultTypeDTO, { status: 200 });
	}),

	http.post('/deliveryresulttypes', async ({ request }) => {
		const body = (await request.json()) as DeliveryResultTypeBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create delivery result type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/deliveryresulttypes', async ({ request }) => {
		const body = (await request.json()) as DeliveryResultTypeBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update delivery result type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/deliveryresulttypes/{code}', ({ params }) => {
		if (params.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete delivery result type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),
];
