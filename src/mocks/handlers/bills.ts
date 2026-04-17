import { HttpResponse } from 'msw';
import { billResults } from '../fixtures/billDTO';
import { billItemDTOs } from '../fixtures/billItemDTO';
import { billPaymentsDTOs } from '../fixtures/billPaymentsDTO';
import { badRequest, http } from '../utils';

type BillBody = {
	bill?: { id?: number };
};

export const bills = [
	http.post('/bills', async ({ request }) => {
		const body = (await request.json()) as BillBody | null;

		if (body?.bill?.id === 0) {
			return HttpResponse.json(badRequest({ message: 'Fail to create bill' }), {
				status: 400,
			});
		}

		return HttpResponse.json(body, { status: 201 });
	}),

	http.get('/bills/pending', ({ request }) => {
		const code = new URL(request.url).searchParams.get('patient_code') || '0';

		return HttpResponse.json(
			billResults.filter((item) => {
				return (
					(+code === 1 || item.id === 10 || item.patient?.code === +code) &&
					item.status === 'O'
				);
			}),
			{ status: 200 },
		);
	}),

	http.get('/bills', ({ request }) => {
		const params = new URL(request.url).searchParams;
		const code = params.get('patient_code') || '0';
		const datefrom = params.get('datefrom');

		return HttpResponse.json(
			billResults.filter((item) => {
				return (
					(+code === 0 || item.patient?.code === +code) &&
					(!datefrom ||
						new Date(datefrom).getFullYear() ===
							new Date(item.date).getFullYear())
				);
			}),
			{ status: 200 },
		);
	}),

	http.get('/bills/payments', ({ request }) => {
		const code = new URL(request.url).searchParams.get('patient_code') || '0';

		return HttpResponse.json(
			billPaymentsDTOs.filter((item) => {
				const bill = billResults.find((b) => b.id === item.billId);
				return +code === 0 || bill?.patient?.code === +code;
			}),
			{ status: 200 },
		);
	}),

	http.get('/bills/payments/{bill_id}', () => {
		return HttpResponse.json(billPaymentsDTOs, { status: 200 });
	}),

	http.get('/bills/items/{bill_id}', () => {
		return HttpResponse.json(billItemDTOs, { status: 200 });
	}),

	http.delete('/bills/{id}', ({ params }) => {
		if (params.id === '-1') {
			return HttpResponse.json(badRequest({ message: 'Fail to delete bill' }), {
				status: 400,
			});
		}

		return HttpResponse.json(true, { status: 200 });
	}),

	http.put('/bills/{id}', async ({ params, request }) => {
		const body = await request.json();
		const id = +(params.id ?? '0');
		const random = Math.random() * id > 0.5 * id;

		if (random) {
			return HttpResponse.json(badRequest({ message: 'Fail to update bill' }), {
				status: 400,
			});
		}

		return HttpResponse.json(body, { status: 200 });
	}),
];
