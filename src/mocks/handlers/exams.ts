import { HttpResponse, http } from 'msw';
import { examsDTO } from '../fixtures/examsDTO';
import { badRequest } from '../utils';

type ExamPayload = {
	exam: {
		code: string;
		description: string;
	};
};

export const exams = [
	http.get('/exams', () => {
		return HttpResponse.json(examsDTO, { status: 200 });
	}),

	http.post('/exams', async ({ request }) => {
		const body = (await request.json()) as ExamPayload;

		if (!body?.exam) {
			return HttpResponse.json(
				badRequest({ message: 'Invalid request body' }),
				{ status: 400 },
			);
		}

		return body.exam.code === 'FAIL'
			? HttpResponse.json(badRequest({ message: 'Fail to create exam' }), {
					status: 400,
				})
			: HttpResponse.json(body.exam, { status: 201 });
	}),

	http.put('/exams/{code}', async ({ request }) => {
		const body = (await request.json()) as ExamPayload;

		if (!body?.exam) {
			return HttpResponse.json(
				badRequest({ message: 'Invalid request body' }),
				{ status: 400 },
			);
		}

		return body.exam.description === 'FAIL'
			? HttpResponse.json(badRequest({ message: 'Fail to update exam' }), {
					status: 400,
				})
			: HttpResponse.json(body.exam, { status: 200 });
	}),

	http.delete('/exams/{code}', ({ params }) => {
		return params.code === '01.04'
			? HttpResponse.json(badRequest({ message: 'Fail to delete exam' }), {
					status: 400,
				})
			: HttpResponse.json(true, { status: 200 });
	}),
];
