import type { PollyServer } from '@pollyjs/core';
import { analysisDTO } from '../fixtures/analysisDTO';

export const admissionRoutes = (server: PollyServer) => {
	server.namespace('/admissions', () => {
		server.get('/patient/:patientCode').intercept((req, res) => {
			const code = req.query.patientCode;
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
	});
};
