import { HttpResponse } from 'msw';
import { wards } from '../fixtures/wardDTO';
import { badRequest, http } from '../utils';

type WardBody = {
	code?: string;
};

export const wardsHandlers = [
	http.get('/wards', () => {
		return HttpResponse.json(wards, { status: 200 });
	}),

	http.post('/wards', async ({ request }) => {
		const body = (await request.json()) as WardBody | null;

		return body?.code === 'FL'
			? HttpResponse.json(badRequest({ message: 'Fail to create ward' }), {
					status: 400,
				})
			: HttpResponse.json(body, { status: 201 });
	}),

	http.put('/wards', async ({ request }) => {
		const body = (await request.json()) as WardBody | null;

		return body?.code === 'FL'
			? HttpResponse.json(badRequest({ message: 'Fail to update ward' }), {
					status: 400,
				})
			: HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/wards/{code}', ({ params }) => {
		return params.code === 'FAIL'
			? HttpResponse.json(badRequest({ message: 'Fail to delete ward' }), {
					status: 400,
				})
			: new HttpResponse(null, { status: 204 });
	}),
];
