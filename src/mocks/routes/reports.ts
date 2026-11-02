import type { PollyServer } from '@pollyjs/core';
import {
	reportContentType,
	statisticReports,
} from '../fixtures/statisticReportDTO';

export const reportRoutes = (server: PollyServer) => {
	server.namespace('/reports', () => {
		server.get('/statistics').intercept((_req, res) => {
			res.status(200).json(statisticReports);
		});
		// Any report download returns an empty file of the requested type
		server.get('/*path').intercept((req, res) => {
			res
				.status(200)
				.setHeader(
					'Content-Type',
					reportContentType(req.query.format as string),
				)
				.send('');
		});
	});
};
