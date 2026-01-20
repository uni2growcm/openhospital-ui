import { HttpResponse } from 'msw';
import type { AdmissionDTO } from '~/generated';
import { admissionDTO } from '../fixtures/admissionDTO';
import { badRequest, http } from '../utils';

const dischargeProps = {
	disDate: '2021-08-27T10:19:44.000Z',
	disType: { code: 'F', description: 'FUGUE' },
};

const admissions = [
	admissionDTO,
	admissionDTO,
	admissionDTO,
	{
		...admissionDTO,
		...dischargeProps,
		patient: { ...admissionDTO.patient, sex: 'F', agetype: 'd3' },
	},
	{ ...admissionDTO, ...dischargeProps },
	{
		...admissionDTO,
		patient: { ...admissionDTO.patient, sex: 'F', agetype: 'd2' },
		...dischargeProps,
	},
	{
		...admissionDTO,
		...dischargeProps,
		disType: { code: 'N', description: 'NORMALE' },
	},
];

type AdmissionBody = {
	admDate?: string;
	note?: string;
};

export const admissionsHandlers = [
	// CREATE
	http.post('/admissions', async ({ request }) => {
		const body = (await request.json()) as AdmissionBody | null;

		if (body?.admDate === 'fail') {
			return HttpResponse.json(badRequest({ message: 'Request failed' }), {
				status: 400,
			});
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	// UPDATE
	http.put('/admissions', async ({ request }) => {
		const body = (await request.json()) as AdmissionBody | null;

		if (body?.note === 'fail') {
			return HttpResponse.json(badRequest({ message: 'Request failed' }), {
				status: 400,
			});
		}

		return HttpResponse.json(body, { status: 200 });
	}),

	// LIST
	http.get('/admissions', () => {
		return HttpResponse.json(
			{
				data: admissions as AdmissionDTO[],
				pageInfo: {},
			},
			{ status: 200 },
		);
	}),

	// BY PATIENT
	http.get('/admissions/patient/{patientCode}', ({ params }) => {
		if (params.patientCode === '10000') {
			return HttpResponse.json(badRequest({ message: 'Request failed' }), {
				status: 400,
			});
		}

		if (params.patientCode === '21266') {
			return new HttpResponse(null, { status: 204 });
		}

		return HttpResponse.json(admissions as AdmissionDTO[], { status: 200 });
	}),

	// CURRENT ADMISSION
	http.get('/admissions/current', ({ request }) => {
		const code = new URL(request.url).searchParams.get('patientCode');

		if (code === '50') {
			return HttpResponse.json(badRequest({ message: 'Request failed' }), {
				status: 400,
			});
		}

		if (code === '21266') {
			return new HttpResponse(null, { status: 204 });
		}

		return HttpResponse.json({ ...admissionDTO, id: 0 }, { status: 200 });
	}),

	// DISCHARGE
	http.post('/admissions/discharge', async ({ request }) => {
		const body = (await request.json()) as AdmissionBody | null;

		if (body?.note === 'fail') {
			return HttpResponse.json(badRequest({ message: 'Request failed' }), {
				status: 400,
			});
		}

		return HttpResponse.json(true, { status: 200 });
	}),

	// DISCHARGES LIST
	http.get('/admissions/discharges', () => {
		return HttpResponse.json(
			{
				data: admissions as AdmissionDTO[],
				pageInfo: {},
			},
			{ status: 200 },
		);
	}),
];
