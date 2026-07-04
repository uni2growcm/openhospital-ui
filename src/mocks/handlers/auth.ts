import { HttpResponse } from 'msw';
import { http, unauthorized } from '../utils';

type LoginBody = {
	username?: string;
};

export const auth = [
	http.post('/auth/login', async ({ request }) => {
		const body = (await request.json()) as LoginBody | null;

		if (body?.username === 'fail') {
			return HttpResponse.json(
				unauthorized({ message: 'Invalid credentials' }),
				{ status: 401 },
			);
		}

		return HttpResponse.json(
			{
				username: 'John Doe',
				token:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJhZG1pbiIsImV4cCI6MTczOTE5MzU1MTAwMH0.D50o5x2gcVcASSwl7EOqmRUDGqIGfhisbXlkujQolrY',
			},
			{ status: 200 },
		);
	}),

	http.post('/auth/logout', () => {
		return new HttpResponse(null, { status: 200 });
	}),
];
