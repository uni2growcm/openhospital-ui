import { HttpResponse, http } from 'msw';
import { examRequestDTO } from '../fixtures/examRequestDTO';
import { badRequest } from '../utils';

type LabExamRequestPayload = {
	code?: string | number;
};

export const labExamRequest = [
	http.get('/laboratories/examRequest/patient/{patId}', () => {
		return HttpResponse.json(examRequestDTO, { status: 200 });
	}),

	http.post('/laboratories/examRequest', async ({ request }) => {
		const body = (await request.json()) as LabExamRequestPayload | null;

		if (body?.code?.toString() === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create lab exam request' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 201 });
	}),
];
