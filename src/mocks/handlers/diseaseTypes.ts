import { HttpResponse, http } from 'msw';
import { diseaseTypesDTO } from '../fixtures/diseaseTypesDTO';
import { badRequest } from '../utils';

type DiseaseTypePayload = {
	code?: string;
};

export const diseaseTypes = [
	http.get('/diseasetypes', () =>
		HttpResponse.json(diseaseTypesDTO, { status: 200 }),
	),

	http.post('/diseasetypes', async ({ request }) => {
		const body = (await request.json()) as DiseaseTypePayload | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create disease type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/diseasetypes', async ({ request }) => {
		const body = (await request.json()) as DiseaseTypePayload | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update disease type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/diseasetypes/{code}', ({ params }) => {
		if (params.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete disease type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),
];
