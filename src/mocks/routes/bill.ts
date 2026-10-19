import type { PollyServer } from '@pollyjs/core';
import { billResults } from '../fixtures/billDTO';
import { billItemDTOs } from '../fixtures/billItemDTO';
import { billPaymentsDTOs } from '../fixtures/billPaymentsDTO';

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

		server.get('/search').intercept((req, res) => {
			const code = req.query.patient_code;
			const status = req.query.status;
			const page = Number(req.query.page ?? 0);
			const size = Number(req.query.size ?? 10);

			const filtered = billResults.filter((item) => {
				return (
					(!code || +code === 0 || item.patient?.code === +code) &&
					(!status || item.status === status)
				);
			});

			const start = page * size;
			const data = filtered.slice(start, start + size);

			res.status(200).json({
				data,
				pageInfo: {
					page,
					size,
					nbOfElements: data.length,
					totalPages: Math.max(Math.ceil(filtered.length / size), 1),
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
			const code = req.query.patient_code;
			res.status(200).json(
				billPaymentsDTOs.filter((item) => {
					const bill = billResults.find((bill) => bill.id === item.billId);
					return +code === 0 || bill?.patient?.code === +code; //(+item.date >= +datefrom && +item.date <= +dateto) ;
				}),
			);
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
