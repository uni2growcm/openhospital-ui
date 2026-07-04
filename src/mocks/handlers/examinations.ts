import { HttpResponse, http } from 'msw';
import { patientExaminationDTO } from '../fixtures/patientExaminationDTO';
import { badRequest, noContent } from '../utils';

type ExaminationPayload = {
	patientCode?: string;
};

export const examinations = [
	http.post('/examinations', async ({ request }) => {
		const body = (await request.json()) as ExaminationPayload | null;

		if (body?.patientCode === 'fail') {
			return HttpResponse.json(badRequest({}), { status: 400 });
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/examinations/{id}', async ({ request }) => {
		const body = (await request.json()) as ExaminationPayload | null;

		if (body?.patientCode === 'fail') {
			return HttpResponse.json(badRequest({}), { status: 400 });
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	http.get('/examinations/defaultPatientExamination', () =>
		HttpResponse.json(patientExaminationDTO, { status: 200 }),
	),

	http.get('/examinations/lastByPatientId/{patId}', ({ params }) => {
		if (params.patId === '1') {
			return HttpResponse.json(badRequest({}), { status: 400 });
		}

		return HttpResponse.json(patientExaminationDTO, { status: 200 });
	}),

	http.get('/examinations/byPatientId/{patId}', ({ params }) => {
		if (params.patId === '1') {
			return HttpResponse.json(badRequest({}), { status: 400 });
		}

		if (params.patId === '2') {
			return noContent();
		}

		return HttpResponse.json(Array(4).fill(patientExaminationDTO), {
			status: 200,
		});
	}),
];
