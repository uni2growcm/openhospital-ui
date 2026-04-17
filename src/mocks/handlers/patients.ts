import { HttpResponse } from 'msw';
import patientDTO from '../fixtures/patientDTO';
import { badRequest, http } from '../utils';

export const patients = [
	http.post('/patients', async ({ request }) => {
		const body = (await request.json()) as { firstName?: string } | null;
		if (body?.firstName === 'fail') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create patient' }),
				{ status: 400 },
			);
		}
		return HttpResponse.json({ ...body, code: 1 }, { status: 201 });
	}),

	http.get('/patients/{code}', ({ params }) => {
		const code = params.code ?? '';
		switch (code) {
			case '1234561':
				return HttpResponse.json(
					badRequest({ message: 'Fail to get patient' }),
					{ status: 400 },
				);
			default:
				return HttpResponse.json(
					{ ...patientDTO, code: +code },
					{ status: 200 },
				);
		}
	}),
];
