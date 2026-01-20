import { HttpResponse } from 'msw';
import { opdDTO } from '../fixtures/opdDTO';
import { operationRowsDTO } from '../fixtures/operationRowsDTO';
import { badRequest, http, noContent } from '../utils';

export const opds = [
	http.post('/opds', async ({ request }) => {
		const body = (await request.json()) as any;
		if (body.note === 'fail') {
			return badRequest({ message: 'Request failed' });
		}
		return HttpResponse.json(body, { status: 201 });
	}),
	http.post('/opds/rows', async ({ request }) => {
		const body = (await request.json()) as any;
		if (body.opdDTO?.note === 'fail') {
			return badRequest({ message: 'Request failed' });
		}
		const operationRows =
			body.operationRows?.map((item: any) => {
				return {
					...item,
					id: Math.floor(Math.random() * 100 + 1),
					opd: opdDTO,
				};
			}) ?? [];
		return HttpResponse.json(
			{
				opdDTO,
				operationRows,
			},
			{ status: 201 },
		);
	}),
	http.put('/opds/{code}', async ({ request }) => {
		const body = (await request.json()) as any;
		return HttpResponse.json(body, { status: 200 });
	}),
	http.put('/opds/rows/{code}', async ({ request }) => {
		const body = (await request.json()) as any;
		const operationRows =
			body.operationRows?.map((item: any) => {
				return {
					...item,
					id: Math.floor(Math.random() * 100 + 1),
					opd: opdDTO,
				};
			}) ?? [];
		return HttpResponse.json(
			{
				opdDTO,
				operationRows,
			},
			{ status: 200 },
		);
	}),
	http.get('/opds/patient/{pcode}', async ({ params }) => {
		const pcode = params.pcode as string;
		if (pcode === '1000') {
			return badRequest({ message: 'Request failed' });
		}
		if (pcode === '200000') {
			return noContent();
		}
		return HttpResponse.json(
			[
				{ opdDTO, operationRows: operationRowsDTO },
				{ opdDTO, operationRows: operationRowsDTO },
				{ opdDTO, operationRows: operationRowsDTO },
				{ opdDTO, operationRows: operationRowsDTO },
			],
			{ status: 200 },
		);
	}),
	http.get('/opds/last/{patientCode}', async ({ params }) => {
		const patientCode = params.patientCode as string;
		if (patientCode === '1000') {
			return badRequest({ message: 'Request failed' });
		}
		if (patientCode === '200000') {
			return noContent();
		}
		return HttpResponse.json(opdDTO, { status: 200 });
	}),
	http.get('/opds/search', ({ request }) => {
		const url = new URL(request.url);
		const code = url.searchParams.get('patientCode');
		if (code === '1000') {
			return badRequest({ message: 'Request failed' });
		}
		if (code === '200000') {
			return noContent();
		}
		if (code && parseInt(code, 10) >= 0) {
			return HttpResponse.json(
				{
					data: [opdDTO, opdDTO, opdDTO],
					pageInfo: {},
				},
				{ status: 200 },
			);
		}
		return HttpResponse.json(
			{
				data: [
					opdDTO,
					{ ...opdDTO, sex: 'F', ageType: 'd1' },
					{ ...opdDTO, sex: 'F', ageType: 'd1' },
					{ ...opdDTO, sex: 'F', ageType: 'd4' },
					{ ...opdDTO, sex: 'M', ageType: 'd4' },
					{ ...opdDTO, sex: 'F', ageType: 'd2' },
					{ ...opdDTO, sex: 'M', ageType: 'd3' },
					{ ...opdDTO, sex: 'M', ageType: 'd2' },
					{ ...opdDTO, sex: 'M', ageType: 'd2' },
					{ ...opdDTO, sex: 'M', ageType: 'd2' },
					{ ...opdDTO, sex: 'F', ageType: 'd5' },
					{ ...opdDTO, sex: 'M', ageType: 'd5' },
				],
				pageInfo: {},
			},
			{ status: 200 },
		);
	}),
	http.delete('/opds/{code}', async ({ params }) => {
		const code = params.code as string;
		if (code === 'fail') {
			return badRequest({ message: 'Request failed' });
		}
		return HttpResponse.json(true, { status: 200 });
	}),
];
