import type { PollyServer } from '@pollyjs/core';
import { billResults } from '../fixtures/billDTO';
import { billItemDTOs } from '../fixtures/billItemDTO';
import { billPaymentsDTOs } from '../fixtures/billPaymentsDTO';

const filterPayments = (
	code: string | undefined,
	user: string | undefined,
	dateFrom: Date | undefined,
	dateTo: Date | undefined,
) => {
	const hasPatientFilter =
		code !== undefined && code !== null && code !== '' && +code !== 0;
	return billPaymentsDTOs.filter((item) => {
		const bill = billResults.find((bill) => bill.id === item.billId);
		const paymentDate = new Date(item.date);
		return (
			(!hasPatientFilter || bill?.patient?.code === +code) &&
			(!user || item.user === user) &&
			(!dateFrom || paymentDate >= dateFrom) &&
			(!dateTo || paymentDate <= dateTo)
		);
	});
};

export const billRoutes = (server: PollyServer) => {
	server.namespace('/bills', () => {
		server.post('/').intercept((req, res) => {
			const body = req.jsonBody();
			switch (body.id) {
				case 'fail':
					res.status(400);
					break;
				default:
					res.status(201).json(body);
					break;
			}
		});

		server.get('/pending').intercept((req, res) => {
			const code = req.query.patient_code;
			res.status(201).json(
				billResults.filter((item) => {
					return (
						(+code === 1 || item.id === 10 || item.patient?.code === +code) &&
						item.status === 'O'
					);
				}),
			);
		});

		server.get('/').intercept((req, res) => {
			const code = req.query.patient_code;
			res.status(201).json(
				billResults.filter((item) => {
					return (
						(+code === 0 || item.patient?.code === +code) &&
						(!req.query.datefrom ||
							new Date(req.query.datefrom?.toString()).getFullYear() ===
								new Date(item.date).getFullYear())
					);
				}),
			);
		});

		server.get('/payments/users').intercept((_req, res) => {
			const users = Array.from(
				new Set(billPaymentsDTOs.map((item) => item.user)),
			).sort();
			res.status(200).json(users);
		});

		server.get('/payments/search').intercept((req, res) => {
			const code = req.query.patient_code?.toString();
			const user = req.query.user?.toString();
			const dateFrom = req.query.datefrom
				? new Date(req.query.datefrom.toString())
				: undefined;
			const dateTo = req.query.dateto
				? new Date(req.query.dateto.toString())
				: undefined;
			const page = req.query.page ? Number(req.query.page) : 0;
			const size = req.query.size ? Number(req.query.size) : 10;

			const filtered = filterPayments(code, user, dateFrom, dateTo);
			const start = page * size;
			const data = filtered.slice(start, start + size);

			res.status(200).json({
				data,
				pageInfo: {
					size,
					page,
					nbOfElements: data.length,
					totalPages: Math.ceil(filtered.length / size),
					totalNbOfElements: filtered.length,
					hasPreviousPage: page > 0,
					hasNextPage: start + size < filtered.length,
				},
			});
		});

		server.get('/payments/:bill_id').intercept((_req, res) => {
			res.status(201).json(billPaymentsDTOs);
		});

		server.get('/items/:bill_id').intercept((_req, res) => {
			res.status(201).json(billItemDTOs);
		});

		server.get('/payments').intercept((req, res) => {
			const code = req.query.patient_code?.toString();
			const dateFrom = req.query.datefrom
				? new Date(req.query.datefrom.toString())
				: undefined;
			const dateTo = req.query.dateto
				? new Date(req.query.dateto.toString())
				: undefined;
			res.status(200).json(filterPayments(code, undefined, dateFrom, dateTo));
		});

		server.delete('/:id').intercept((req, res) => {
			const code = req.params.id;
			switch (code) {
				case '-1':
					res.status(400);
					break;
				default:
					res.status(200);
					break;
			}
		});

		server.put('/:id').intercept((req, res) => {
			const code = req.params.id;
			const random = Math.random() * +code > 0.5 * +code;
			switch (random) {
				case true:
					res.status(400);
					break;
				default:
					res.status(200).json(req.jsonBody());
					break;
			}
		});
	});
};
