import { HttpResponse } from 'msw';
import { permissionList } from '../fixtures/permissionList';
import { userGroupsDTO } from '../fixtures/userGroupsDTO';
import { usersDTO } from '../fixtures/usersDTO';
import { badRequest, http } from '../utils';

export const users = [
	http.get('/users/me', () => {
		return HttpResponse.json(
			{
				userName: 'admin',
				permissions: permissionList,
				userGroup: userGroupsDTO[0],
			},
			{ status: 200 },
		);
	}),

	http.get('/users', () => {
		return HttpResponse.json(usersDTO, { status: 200 });
	}),

	http.get('/users/{username}', () => {
		return HttpResponse.json(usersDTO[0], { status: 200 });
	}),

	http.post('/users', () => {
		return HttpResponse.json(usersDTO[0], { status: 201 });
	}),

	http.put('/users/{username}', async ({ request }) => {
		const body = await request.json();
		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/users/{username}', ({ params }) => {
		if (params.username === 'FAIL') {
			return HttpResponse.json(badRequest({ message: 'Fail to delete user' }), {
				status: 400,
			});
		}

		return new HttpResponse(null, { status: 204 });
	}),
];
