import { format } from 'date-fns';
import { HttpResponse } from 'msw';
import { therapyRowDTO } from '../fixtures/therapyRowDTO';
import { badRequest, http } from '../utils';

type TherapyBody = {
	startDate?: number | string;
	endDate?: number | string;
	therapyID?: number | string;
};

export const therapies = [
	http.post('/therapies', async ({ request }) => {
		const body = (await request.json()) as TherapyBody | null;

		if (!body || body.startDate === undefined || body.endDate === undefined) {
			return HttpResponse.json(badRequest({}), { status: 400 });
		}

		body.startDate = format(new Date(+body.startDate), 'yyyy-MM-dd HH:mm:ss');
		body.endDate = format(new Date(+body.endDate), 'yyyy-MM-dd HH:mm:ss');

		if (body.therapyID?.toString() === '25') {
			return HttpResponse.json(badRequest({}), { status: 400 });
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.post('/therapies/replace', async ({ request }) => {
		const body = (await request.json()) as unknown[];

		const first = body?.[0];
		if (!first) {
			return HttpResponse.json(
				badRequest({ message: 'Invalid request body' }),
				{ status: 400 },
			);
		}

		if (first.toString() === '42') {
			return HttpResponse.json(badRequest({}), { status: 400 });
		}

		return HttpResponse.json(first, { status: 201 });
	}),

	http.get('/therapies/{code_patient}', ({ params }) => {
		if (params.code_patient === '10000') {
			return HttpResponse.json(badRequest({}), { status: 400 });
		}

		if (params.code_patient === '21266') {
			return new HttpResponse(null, { status: 204 });
		}

		return HttpResponse.json(
			[therapyRowDTO, therapyRowDTO, therapyRowDTO, therapyRowDTO],
			{ status: 200 },
		);
	}),
];
