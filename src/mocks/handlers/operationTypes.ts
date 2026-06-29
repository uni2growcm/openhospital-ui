import { HttpResponse } from 'msw';
import { operationTypesDTO } from '../fixtures/operationTypeDTO';
import { badRequest, http } from '../utils';

export const operationTypes = [
	http.get('/operationtypes', () =>
		HttpResponse.json(operationTypesDTO, { status: 200 }),
	),

	http.post('/operationtypes', async ({ request }) => {
		const body = (await request.json()) as { code?: string } | null;
		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create operation type' }),
				{ status: 400 },
			);
		}
		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/operationtypes/{code}', async ({ request }) => {
		const body = (await request.json()) as { code?: string } | null;
		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update operation type' }),
				{ status: 400 },
			);
		}
		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/operationtypes/{code}', ({ params }) => {
		const code = params.code ?? '';
		if (code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete operation type' }),
				{ status: 400 },
			);
		}
		return HttpResponse.json(true, { status: 200 });
	}),
];
