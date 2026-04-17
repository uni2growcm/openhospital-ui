import { HttpResponse } from 'msw';
import visitDTO from '../fixtures/visitDTO';
import { badRequest, http, notFound } from '../utils';

type VisitBody = {
	duration?: number;
	visitID?: number | string;
};

export const visits = [
	http.post('/visits', async ({ request }) => {
		const body = (await request.json()) as VisitBody | null;

		switch (body?.duration) {
			case 100:
				return HttpResponse.json(
					badRequest({ message: 'Fail to create visit' }),
					{ status: 400 },
				);
			case 30:
				return new HttpResponse(null, { status: 204 });
			default:
				return HttpResponse.json(body, { status: 201 });
		}
	}),

	http.put('/visits/{visitID}', async ({ request }) => {
		const body = (await request.json()) as VisitBody | null;

		switch (body?.duration) {
			case 100:
				return HttpResponse.json(
					badRequest({ message: 'Fail to update visit' }),
					{ status: 400 },
				);
			case 30:
				return HttpResponse.json(notFound({ message: 'Visit not found' }), {
					status: 404,
				});
			default:
				return HttpResponse.json(body, { status: 200 });
		}
	}),

	http.get('/visits/patient/{patID}', ({ params }) => {
		switch (params.patID) {
			case '1':
				return HttpResponse.json(
					badRequest({ message: 'Fail to get visits' }),
					{ status: 400 },
				);
			case '2':
				return new HttpResponse(null, { status: 204 });
			default:
				return HttpResponse.json([visitDTO, visitDTO, visitDTO], {
					status: 200,
				});
		}
	}),
];
