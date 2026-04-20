import { HttpResponse } from 'msw';
import { analysisDTO } from '../fixtures/analysisDTO';
import { badRequest, http } from '../utils';

const analysis = analysisDTO;

export const analysisHandlers = [
	http.get('/labbook/patients/{id}/analysis', ({ params }) => {
		if (params.id === '10000') {
			return HttpResponse.json(badRequest({ message: 'Request failed' }), {
				status: 400,
			});
		}

		if (params.id === '21266') {
			return new HttpResponse(null, { status: 204 });
		}
		return HttpResponse.json(analysis, { status: 200 });
	}),

	http.get('/labbook/reports/grouped/download', () => {
		return HttpResponse.json({ status: 200 });
	}),
];
