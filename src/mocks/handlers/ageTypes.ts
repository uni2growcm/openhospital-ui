import { HttpResponse } from 'msw';
import { ageTypeDTO } from '../fixtures/ageTypeDTO';
import { badRequest, http } from '../utils';

type AgeTypeBody = Array<{ to?: number }>;

export const ageTypes = [
	http.get('/agetypes', () => {
		return HttpResponse.json(ageTypeDTO, { status: 200 });
	}),

	http.put('/agetypes', async ({ request }) => {
		const body = (await request.json()) as AgeTypeBody | null;

		if (body?.[0]?.to === 1) {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update age types' }),
				{ status: 400 },
			);
		}

		return HttpResponse.json(body, { status: 200 });
	}),
];
