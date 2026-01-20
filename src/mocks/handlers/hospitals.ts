import { HttpResponse, http } from 'msw';
import { hospitalDTO } from '../fixtures/hospitalDTO';
import { badRequest } from '../utils';

type HospitalPayload = {
	description: string;
};

export const hospitals = [
	http.get('/hospitals', () => {
		return HttpResponse.json(hospitalDTO, { status: 200 });
	}),

	http.get('/hospitals/{code}', ({ params }) => {
		const code = params.code as string;

		if (code === '1') {
			return HttpResponse.json(badRequest({ message: 'Request failed' }), {
				status: 400,
			});
		}

		if (code === '2') {
			return new HttpResponse(null, { status: 204 });
		}

		return HttpResponse.json(hospitalDTO, { status: 200 });
	}),

	http.put('/hospitals/{code}', async ({ request }) => {
		const body = (await request.json()) as HospitalPayload | null;

		if (!body?.description) {
			return HttpResponse.json(badRequest({ message: 'Invalid payload' }), {
				status: 400,
			});
		}

		return body.description === 'FAIL'
			? HttpResponse.json(badRequest({ message: 'Invalid payload' }), {
					status: 400,
				})
			: HttpResponse.json(body, { status: 200 });
	}),
];
