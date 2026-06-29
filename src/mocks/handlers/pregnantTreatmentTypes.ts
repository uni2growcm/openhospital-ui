import { HttpResponse } from 'msw';
import { pregnantTreatmentTypeDTO } from '../fixtures/pregnantTreatmentDTO';
import { badRequest, http } from '../utils';

type PregnantTreatmentType = {
	code?: string;
};

export const pregnantTreatmentTypes = [
	http.get('/pregnanttreatmenttypes', () => {
		return HttpResponse.json(pregnantTreatmentTypeDTO, { status: 200 });
	}),

	http.post('/pregnanttreatmenttypes', async ({ request }) => {
		const body = (await request.json()) as PregnantTreatmentType | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create pregnant treatment type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/pregnanttreatmenttypes/{code}', async ({ request }) => {
		const body = (await request.json()) as PregnantTreatmentType | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update pregnant treatment type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/pregnanttreatmenttypes/{code}', ({ params }) => {
		if (params.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete pregnant treatment type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),
];
