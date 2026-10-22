import type { PollyServer } from '@pollyjs/core';
import { priceDTO } from '../fixtures/priceDTO';
import { pricesOthersDTO } from '../fixtures/pricesOthersDTO';

export const pricesRoutes = (server: PollyServer) => {
	server.namespace('/pricelists/prices', () => {
		server.get('/').intercept((req, res) => {
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
	});

	server.namespace('/pricesothers', () => {
		server.get('/').intercept((_req, res) => {
			res.status(200).json(pricesOthersDTO);
		});
	});
};
