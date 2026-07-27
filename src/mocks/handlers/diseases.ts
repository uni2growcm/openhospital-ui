import { HttpResponse, http } from 'msw';
import { diseasesDTO } from '../fixtures/diseasesDTO';
import { badRequest } from '../utils';

type DiseasePayload = {
	code?: string;
	description?: string;
};

export const diseases = [
	http.get('/diseases/all', () =>
		HttpResponse.json(diseasesDTO, { status: 200 }),
	),

	http.get('/diseases/opd', () =>
		HttpResponse.json(
			diseasesDTO.filter((d) => d.opdInclude),
			{ status: 200 },
		),
	),

	http.get('/diseases/ipd/in', () =>
		HttpResponse.json(
			diseasesDTO.filter((d) => d.ipdInInclude),
			{ status: 200 },
		),
	),

	http.get('/diseases/ipd/out', () =>
		HttpResponse.json(
			diseasesDTO.filter((d) => d.ipdOutInclude),
			{ status: 200 },
		),
	),

	http.post('/diseases', async ({ request }) => {
		const body = (await request.json()) as DiseasePayload | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create disease' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/diseases', async ({ request }) => {
		const body = (await request.json()) as DiseasePayload | null;

		if (body?.description === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update disease' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),
];
