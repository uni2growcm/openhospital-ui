import { HttpResponse, http, type JsonBodyType } from 'msw';
import { makeServer } from './server';

export { http };

export async function enableMocking() {
	if (import.meta.env.VITE_USE_MOCK_API !== 'true') {
		return;
	}

	makeServer();
}

export function badRequest<T extends JsonBodyType>(response: T) {
	return HttpResponse.json(response, { status: 400 });
}

export function notFound<T extends JsonBodyType>(response: T) {
	return HttpResponse.json(response, { status: 404 });
}

export function unauthorized<T extends JsonBodyType>(response: T) {
	return HttpResponse.json(response, { status: 401 });
}

export function noContent() {
	return HttpResponse.json(null, { status: 204 });
}
