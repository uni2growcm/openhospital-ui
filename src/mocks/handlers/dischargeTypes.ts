import { HttpResponse } from 'msw';
import { dischargeTypesDTO } from '../fixtures/dischargeTypesDTO';
import { badRequest, http } from '../utils';

type DischargeTypeBody = {
	code?: string;
};

export const dischargeTypes = [
	http.get('/dischargetypes', () => {
		return HttpResponse.json(dischargeTypesDTO, { status: 200 });
	}),

	http.post('/dischargetypes', async ({ request }) => {
		const body = (await request.json()) as DischargeTypeBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create discharge type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/dischargetypes', async ({ request }) => {
		const body = (await request.json()) as DischargeTypeBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update discharge type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/dischargetypes/{code}', ({ params }) => {
		if (params.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete discharge type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),
];
