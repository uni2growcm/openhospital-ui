import type { PollyServer } from '@pollyjs/core';
import { analysisDTO } from '../fixtures/analysisDTO';

export const analysisRoutes = (server: PollyServer) => {
	server.namespace('/labbook', () => {
		server.get('/patients/:id/analysis').intercept((req, res) => {
			const code = req.query.id;
			switch (code) {
				case '10000':
					res.status(400);
					break;
				case '21266':
					res.status(204);
					break;
				default:
					res.status(200).json(analysisDTO);
			}
		});
		server.post('/reports/grouped/download').intercept((_req, res) => {
			res.status(200);
		});
	});
};
