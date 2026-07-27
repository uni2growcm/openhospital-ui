import { HttpResponse, http } from 'msw';
import { examRowsDTO } from '../fixtures/examRowsDTO';

export const examRows = [
	http.get('/examrows/byExamCode/{examCode}', () => {
		return HttpResponse.json(examRowsDTO, { status: 200 });
	}),
];
