import type { PollyServer } from '@pollyjs/core';
import { reductionPlanDTOs } from '../fixtures/reductionPlanDTO';

export const reductionPlansRoutes = (server: PollyServer) => {
	server.namespace('/reduction-plans', () => {
		server.get('/').intercept((_req, res) => {
			res.status(200).json(reductionPlanDTOs);
		});

		server.get('/:id').intercept((req, res) => {
			const id = Number(req.params.id);
			const plan = reductionPlanDTOs.find((item) => item.id === id);
			if (!plan) {
				res.status(404);
				return;
			}
			res.status(200).json(plan);
		});

		server.post('/').intercept((req, res) => {
			const body = req.jsonBody();
			switch (body.description) {
				case 'fail':
					res.status(400).json({ message: 'Fail to create reduction plan' });
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
					res.status(400).json({ message: 'Fail to update reduction plan' });
					break;
				default:
					res.status(200).json({ ...body, id: Number(id) });
			}
		});

		server.delete('/:id').intercept((req, res) => {
			const id = req.params.id;
			switch (id) {
				case '-1':
					res.status(400).json({ message: 'Fail to delete reduction plan' });
					break;
				default:
					res.status(200).json(true);
			}
		});
	});
};
