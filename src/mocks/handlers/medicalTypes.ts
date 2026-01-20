import { HttpResponse, http } from 'msw';
import { medicalTypesDTO } from '../fixtures/medicalTypesDTO';
import { badRequest } from '../utils';

type MedicalTypePayload = { code?: string };

export const medicalTypes = [
	http.get('/medicaltypes', () =>
		HttpResponse.json(medicalTypesDTO, { status: 200 }),
	),

	http.post('/medicaltypes', async ({ request }) => {
		const body = (await request.json()) as MedicalTypePayload | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create medical type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 201 });
	}),
];
