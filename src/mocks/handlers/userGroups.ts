import { HttpResponse } from 'msw';
import { userGroupsDTO } from '../fixtures/userGroupsDTO';
import { http, notFound } from '../utils';

export const userGroups = [
	http.get('/usergroups', () => {
		return HttpResponse.json(userGroupsDTO, { status: 200 });
	}),

	http.get('/usergroups/{group_code}', ({ params }) => {
		const group = userGroupsDTO.find(({ code }) => code === params.group_code);

		if (!group) {
			return HttpResponse.json(
				notFound({
					status: 'BAD_REQUEST',
					message: 'User group not found.',
					debugMessage: 'User group not found.',
					timestamp: '2024-09-16T08:02:53.878312662',
					description: null,
				}),
				{ status: 404 },
			);
		}

		return HttpResponse.json(group, { status: 200 });
	}),

	http.delete('/usergroups/{group_code}/permissions/{id}', () => {
		return new HttpResponse(null, { status: 204 });
	}),

	http.post('/usergroups/{group_code}/permissions/{id}', ({ params }) => {
		return HttpResponse.json(Number(params.id), { status: 201 });
	}),

	http.post('/usergroups', () => {
		return HttpResponse.json(userGroupsDTO[0], { status: 201 });
	}),

	http.put('/usergroups/{group_code}', () => {
		return HttpResponse.json(userGroupsDTO[0], { status: 200 });
	}),

	http.delete('/usergroups/{group_code}', () => {
		return new HttpResponse(null, { status: 204 });
	}),
];
