import { HttpResponse, http } from 'msw';
import { operationsDTO } from '../fixtures/operationsDTO';
import { badRequest } from '../utils';

type OperationPayload = {
	code?: string;
	remarks?: string;
	id?: number;
};

export const operations = [
	http.get('/operations', () =>
		HttpResponse.json(operationsDTO, { status: 200 }),
	),

	http.post('/operations/rows', async ({ request }) => {
		const body = (await request.json()) as OperationPayload | null;

		if (body?.remarks === 'fail') {
			return HttpResponse.json(badRequest({}), { status: 400 });
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/operations/rows', async ({ request }) => {
		const body = (await request.json()) as OperationPayload | null;

		if (body?.remarks === 'fail') {
			return HttpResponse.json(badRequest({}), { status: 400 });
		}

		return HttpResponse.json(body?.id ?? 0, { status: 200 });
	}),
];
