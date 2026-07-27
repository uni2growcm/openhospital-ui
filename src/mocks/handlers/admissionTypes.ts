import { HttpResponse } from 'msw';
import { admissionTypesDTO } from '../fixtures/admissionsTypesDTO';
import { badRequest, http } from '../utils';

type AdmissionTypeBody = {
	code?: string;
};

export const admissionTypes = [
	// LIST
	http.get('/admissiontypes', () => {
		return HttpResponse.json(admissionTypesDTO, { status: 200 });
	}),

	// CREATE
	http.post('/admissiontypes', async ({ request }) => {
		const body = (await request.json()) as AdmissionTypeBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create admission type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	// UPDATE
	http.put('/admissiontypes', async ({ request }) => {
		const body = (await request.json()) as AdmissionTypeBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update admission type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	// DELETE
	http.delete('/admissiontypes/{code}', ({ params }) => {
		if (params.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete admission type' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),
];
