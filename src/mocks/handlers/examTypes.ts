import { HttpResponse, http } from 'msw';
import { examTypesDTO } from '../fixtures/examTypesDTO';
import { badRequest } from '../utils';

type ExamTypePayload = {
	code: string;
};

export const examTypes = [
	http.get('/examtypes', () => {
		return HttpResponse.json(examTypesDTO, { status: 200 });
	}),

	http.post('/examtypes', async ({ request }) => {
		const body = (await request.json()) as ExamTypePayload | null;

		if (!body?.code) {
			return HttpResponse.json(
				badRequest({ message: 'Invalid request body' }),
				{ status: 400 },
			);
		}

		return body.code === 'FAIL'
			? HttpResponse.json(badRequest({ message: 'Fail to create exam type' }), {
					status: 400,
				})
			: HttpResponse.json(body, { status: 201 });
	}),

	http.put('/examtypes/{code}', async ({ request }) => {
		const body = (await request.json()) as ExamTypePayload | null;

		if (!body?.code) {
			return HttpResponse.json(
				badRequest({ message: 'Invalid request body' }),
				{ status: 400 },
			);
		}

		return body.code === 'FAIL'
			? HttpResponse.json(badRequest({ message: 'Fail to update exam type' }), {
					status: 400,
				})
			: HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/examtypes/{code}', ({ params }) => {
		const code = params.code as string;

		return code === 'FAIL'
			? HttpResponse.json(badRequest({ message: 'Fail to delete exam type' }), {
					status: 400,
				})
			: HttpResponse.json(true, { status: 200 });
	}),
];
