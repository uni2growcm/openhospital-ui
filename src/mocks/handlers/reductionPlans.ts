import { HttpResponse } from 'msw';
import { reductionPlanDTOs } from '../fixtures/reductionPlanDTO';
import { badRequest, http } from '../utils';

export const reductionPlans = [
	http.get('/reduction-plans', () => {
		return HttpResponse.json(reductionPlanDTOs, { status: 200 });
	}),

	http.get('/reduction-plans/{id}', ({ params }) => {
		const plan = reductionPlanDTOs.find(
			(item) => item.id === Number(params.id),
		);
		if (!plan) {
			return HttpResponse.json(null, { status: 404 });
		}
		return HttpResponse.json(plan, { status: 200 });
	}),

	http.post('/reduction-plans', async ({ request }) => {
		const body = (await request.json()) as { description?: string };
		if (body.description === 'fail') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to create reduction plan' }),
				{ status: 400 },
			);
		}
		return HttpResponse.json(body, { status: 201 });
	}),

	http.put('/reduction-plans/{id}', async ({ params, request }) => {
		if (params.id === '-1') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to update reduction plan' }),
				{ status: 400 },
			);
		}
		const body = await request.json();
		return HttpResponse.json(body, { status: 200 });
	}),

	http.delete('/reduction-plans/{id}', ({ params }) => {
		if (params.id === '-1') {
			return HttpResponse.json(
				badRequest({ message: 'Fail to delete reduction plan' }),
				{ status: 400 },
			);
		}
		return HttpResponse.json(true, { status: 200 });
	}),
];
