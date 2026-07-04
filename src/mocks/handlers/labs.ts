import { isEmpty } from 'lodash';
import { HttpResponse, http } from 'msw';
import { labWithRowsDTO } from '../fixtures/labWithRowsDTO';
import { materialsDTO } from '../fixtures/materialsDTO';
import { badRequest, noContent, notFound } from '../utils';

type LabPayload = {
	laboratoryDTO?: {
		note?: string;
	};
};

export const laboratories = [
	http.get('/laboratories/exams/{code}', ({ params }) => {
		const code = params.code;

		if (!code) {
			return HttpResponse.json(badRequest({ message: 'Invalid code' }), {
				status: 400,
			});
		}

		if (code === '1000') {
			return HttpResponse.json(badRequest({ message: 'Request failed' }), {
				status: 400,
			});
		}

		if (code === '2000') {
			return noContent();
		}

		const lab = labWithRowsDTO.find(
			(e) => e.laboratoryDTO?.code === Number(code),
		);

		if (!lab || isEmpty(lab)) {
			return HttpResponse.json(notFound({ message: 'Not found' }), {
				status: 404,
			});
		}

		return HttpResponse.json(lab, { status: 200 });
	}),

	http.get('/laboratories/exams', ({ request }) => {
		const url = new URL(request.url);
		const patientCode = url.searchParams.get('patientCode');
		const page = Number(url.searchParams.get('page') ?? 0);

		if (patientCode === '1000') {
			return HttpResponse.json(badRequest({ message: 'Request failed' }), {
				status: 400,
			});
		}

		if (patientCode === '200000') {
			return noContent();
		}

		return HttpResponse.json(
			{
				data: labWithRowsDTO,
				pageInfo: {
					totalPages: 8,
					page,
				},
			},
			{ status: 200 },
		);
	}),

	http.post('/laboratories', async ({ request }) => {
		const body = (await request.json()) as LabPayload | null;

		if (body?.laboratoryDTO?.note === 'ERROR') {
			return HttpResponse.json(badRequest({ message: 'Request failed' }), {
				status: 400,
			});
		}

		return HttpResponse.json(true, { status: 201 });
	}),

	http.get('/laboratories/materials', () =>
		HttpResponse.json(materialsDTO, { status: 200 }),
	),
];
