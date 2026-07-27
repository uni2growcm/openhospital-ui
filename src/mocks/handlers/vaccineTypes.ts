import { HttpResponse } from 'msw';
import vaccineTypesDTO from '../fixtures/vaccineTypesDTO';
import { badRequest, http } from '../utils';

type VaccineTypeBody = {
	code?: string;
};

export const vaccineTypes = [
	http.get('/vaccinetypes', () => {
		return HttpResponse.json(vaccineTypesDTO, { status: 200 });
	}),

	http.post('/vaccinetypes', async ({ request }) => {
		const body = (await request.json()) as VaccineTypeBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create vaccine type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/vaccinetypes', async ({ request }) => {
		const body = (await request.json()) as VaccineTypeBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update vaccine type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/vaccinetypes/{code}', ({ params }) => {
		if (params.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete vaccine type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),
];
