import type { PollyServer } from '@pollyjs/core';
import { staffDTO } from '../fixtures/staffDTO';

export const staffRoutes = (server: PollyServer) => {
	server.namespace('/staff', () => {
		server.get('/paged').intercept((_req, res) => {
			res.status(200).json({ data: staffDTO, pageInfo: {} });
		});
		server.get('/search').intercept((req, res) => {
			const keyword = String(req.query.keyword ?? '').toLowerCase();
			const filtered = keyword
				? staffDTO.filter(
						(staffMember) =>
							staffMember.firstName.toLowerCase().includes(keyword) ||
							staffMember.lastName.toLowerCase().includes(keyword),
					)
				: staffDTO;
			res.status(200).json(filtered);
		});
		server.get('/').intercept((_req, res) => {
			res.status(200).json(staffDTO);
		});
		server.get('/:code').intercept((req, res) => {
			const staffMember = staffDTO.find(
				(member) => `${member.code}` === req.params.code,
			);

			if (staffMember) {
				res.status(200).json(staffMember);
			} else {
				res.status(404).json({ message: 'Staff not found' });
			}
		});
		server.post('/').intercept((req, res) => {
			const body = req.jsonBody();
			switch (body.firstName) {
				case 'FAIL':
					res.status(400).json({ message: 'Fail to create staff' });
					break;
				default:
					res.status(200).json(body);
			}
		});
		server.put('/').intercept((req, res) => {
			const body = req.jsonBody();
			switch (body.firstName) {
				case 'FAIL':
					res.status(400).json({ message: 'Fail to update staff' });
					break;
				default:
					res.status(200).json(body);
			}
		});
		server.delete('/:code').intercept((req, res) => {
			const code = req.params.code;
			switch (code) {
				case 'FAIL':
					res.status(400).json({ message: 'Fail to delete staff' });
					break;
				default:
					res.status(204);
			}
		});
	});
};
