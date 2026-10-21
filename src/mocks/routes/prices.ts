import type { PollyServer } from '@pollyjs/core';
import { priceDTO } from '../fixtures/priceDTO';
import { priceListDTO } from '../fixtures/priceListDTO';
import { pricesOthersDTO } from '../fixtures/pricesOthersDTO';

export const pricesRoutes = (server: PollyServer) => {
	server.namespace('/pricelists', () => {
		server.get('/prices').intercept((req, res) => {
			const code = req.params.code;
			switch (code) {
				case '1':
					res.status(400);
					break;
				case '2':
					res.status(204);

					break;
				default:
					res.status(200).json(priceDTO);
			}
		});

		server.get('/').intercept((_req, res) => {
			res.status(200).json(priceListDTO);
		});

		server.post('/').intercept((req, res) => {
			const body = req.jsonBody();
			switch (body.code) {
				case 'fail':
					res.status(400).json({ message: 'Fail to create price list' });
					break;
				default:
					res.status(201).json({ ...body, id: body.id ?? 99 });
			}
		});

		server.put('/:id').intercept((req, res) => {
			const id = req.params.id;
			const body = req.jsonBody();
			switch (id) {
				case '-1':
					res.status(400).json({ message: 'Fail to update price list' });
					break;
				default:
					res.status(200).json({ ...body, id: Number(id) });
			}
		});

		server.delete('/:id').intercept((req, res) => {
			const id = req.params.id;
			switch (id) {
				case '-1':
					res.status(400).json({ message: 'Fail to delete price list' });
					break;
				default:
					res.status(200).json(true);
			}
		});

		server.put('/:id/prices').intercept((req, res) => {
			const id = req.params.id;
			switch (id) {
				case '-1':
					res.status(400).json({ message: 'Fail to update prices' });
					break;
				default:
					res.status(200).json(true);
			}
		});

		server.get('/duplicate/byfactor/:id').intercept((req, res) => {
			const id = req.params.id;
			switch (id) {
				case '-1':
					res.status(400).json({ message: 'Fail to duplicate price list' });
					break;
				default:
					res.status(200).json(true);
			}
		});

		server.get('/duplicate/:id').intercept((req, res) => {
			const id = req.params.id;
			switch (id) {
				case '-1':
					res.status(400).json({ message: 'Fail to duplicate price list' });
					break;
				default:
					res.status(200).json(true);
			}
		});
	});

	server.namespace('/pricesothers', () => {
		server.get('/').intercept((_req, res) => {
			res.status(200).json(pricesOthersDTO);
		});
	});
};
