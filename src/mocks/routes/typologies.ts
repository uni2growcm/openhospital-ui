import type { PollyServer } from '@pollyjs/core';
import { typologiesDTO } from '../fixtures/typologiesDTO';

export const typologiesRoutes = (server: PollyServer) => {
	server.namespace('/typologies', () => {
		server.get('/').intercept((req, res) => {
			const family = req.query.family;
			const typologies = family
				? typologiesDTO.filter((typology) => typology.family === family)
				: typologiesDTO;
			res.status(200).json(typologies);
		});
		server.get('/search').intercept((req, res) => {
			const { search, family } = req.query;
			const page = Number(req.query.page ?? 0);
			const size = Number(req.query.size ?? 20);
			const typologies = typologiesDTO.filter(
				(typology) =>
					(!family || typology.family === family) &&
					(!search ||
						typology.code.includes(String(search).toUpperCase()) ||
						typology.description
							.toLowerCase()
							.includes(String(search).toLowerCase())),
			);
			const content = typologies.slice(page * size, (page + 1) * size);
			const totalPages = Math.ceil(typologies.length / size);
			res.status(200).json({
				content,
				number: page,
				size,
				numberOfElements: content.length,
				totalElements: typologies.length,
				totalPages,
				first: page === 0,
				last: page >= totalPages - 1,
				empty: content.length === 0,
			});
		});
		server.get('/check/:code').intercept((req, res) => {
			const code = req.params.code;
			res
				.status(200)
				.json(typologiesDTO.some((typology) => typology.code === code));
		});
		server.get('/:code').intercept((req, res) => {
			const code = req.params.code;
			const typology = typologiesDTO.find((item) => item.code === code);
			if (typology) {
				res.status(200).json(typology);
			} else {
				res.status(404).json({ message: 'Typology not found' });
			}
		});
		server.post('/').intercept((req, res) => {
			const body = req.jsonBody();
			switch (body.code) {
				case 'FAIL':
					res.status(400).json({ message: 'Fail to create typology' });
					break;
				default:
					res.status(201).json(body);
			}
		});
		server.put('/').intercept((req, res) => {
			const body = req.jsonBody();
			switch (body.code) {
				case 'FAIL':
					res.status(400).json({ message: 'Fail to update typology' });
					break;
				default:
					res.status(200).json(body);
			}
		});
		server.delete('/:code').intercept((req, res) => {
			const code = req.params.code;
			switch (code) {
				case 'FAIL':
					res.status(400).json({ message: 'Fail to delete typology' });
					break;
				default:
					res.status(200).json(true);
			}
		});
	});
};
