import { HttpResponse } from 'msw';
import { vaccineDTO } from '../fixtures/vaccineDTO';
import { badRequest, http } from '../utils';

type VaccineBody = {
	code?: string;
};

export const vaccines = [
	http.get('/vaccines', () => {
		return HttpResponse.json(vaccineDTO, { status: 200 });
	}),

	http.post('/vaccines', async ({ request }) => {
		const body = (await request.json()) as VaccineBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create vaccine' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/vaccines', async ({ request }) => {
		const body = (await request.json()) as VaccineBody | null;

		if (body?.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update vaccine' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/vaccines/{code}', ({ params }) => {
		if (params.code === 'FAIL') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete vaccine' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(true, { status: 200 });
	}),
];
