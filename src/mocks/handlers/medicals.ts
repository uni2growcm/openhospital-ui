import { HttpResponse, http } from 'msw';
import { medicalDTO } from '../fixtures/medicalDTO';

export const medicals = [
	http.get('/medicals', () => HttpResponse.json([medicalDTO], { status: 200 })),
];
