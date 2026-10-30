import type { PollyServer } from '@pollyjs/core';

export const settingsRoutes = (server: PollyServer) => {
	server.namespace('/usersettings', () => {
		server.get('/').intercept((_req, res) => {
			res
				.status(200)
				.json([{ id: 1, configName: 'landing', configValue: '/' }]);
		});
		server.get('/dashboard').intercept((_req, res) => {
			res.status(200).json({}); // TODO: Add a response body from api. Missing api definition.
		});
		server.post('/').intercept((req, res) => {
			res.status(200).json({ id: 1, ...req.jsonBody() });
		});
		server.put('/:id').intercept((req, res) => {
			res.status(200).json({ ...req.jsonBody(), id: Number(req.params.id) });
		});
	});
};
