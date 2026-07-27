import { permissionDTO } from '../fixtures/permissionDTO';
import { http } from '../utils';

export const permissions = [
	http.get('/permissions', async () => {
		return new Response(JSON.stringify(permissionDTO), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}),
];
