import { HttpResponse } from 'msw';
import {
	reportContentType,
	statisticReports,
} from '../fixtures/statisticReportDTO';
import { http } from '../utils';

export const reports = [
	http.get('/reports/statistics', () => {
		return HttpResponse.json(statisticReports, { status: 200 });
	}),

	// Any report download returns an empty file of the requested type
	http.get('/reports/*', ({ request }) => {
		const type = reportContentType(
			new URL(request.url).searchParams.get('format'),
		);
		return new HttpResponse(new Blob([], { type }), {
			status: 200,
			headers: { 'Content-Type': type },
		});
	}),
];
