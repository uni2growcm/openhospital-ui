import { HttpResponse } from 'msw';
import { typologiesDTO } from '../fixtures/typologiesDTO';
import { badRequest, http, notFound } from '../utils';

type TypologyBody = {
	code?: string;
};

export const typologies = [
	http.get('/typologies', ({ request }) => {
		const family = new URL(request.url).searchParams.get('family');
		const data = family
			? typologiesDTO.filter((typology) => typology.family === family)
			: typologiesDTO;

		return HttpResponse.json(data, { status: 200 });
	}),

	http.get('/typologies/check/:code', ({ params }) => {
		return HttpResponse.json(
			typologiesDTO.some((typology) => typology.code === params.code),
			{ status: 200 },
		);
	}),

	http.get('/typologies/:code', ({ params }) => {
		const typology = typologiesDTO.find((item) => item.code === params.code);

		if (!typology) {
			return notFound({ message: 'Typology not found' });
		}

		return HttpResponse.json(typology, { status: 200 });
	}),

	http.post('/typologies', async ({ request }) => {
		const body = (await request.json()) as TypologyBody | null;

		if (body?.code === 'FAIL') {
			return badRequest({ message: 'Fail to create typology' });
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/typologies', async ({ request }) => {
		const body = (await request.json()) as TypologyBody | null;

		if (body?.code === 'FAIL') {
			return badRequest({ message: 'Fail to update typology' });
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/typologies/:code', ({ params }) => {
		if (params.code === 'FAIL') {
			return badRequest({ message: 'Fail to delete typology' });
		}

		return HttpResponse.json(true, { status: 200 });
	}),
];
