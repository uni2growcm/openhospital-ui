import type { TPaymentsFilterValues } from './types';

export const getDefaultFilterValues = (): TPaymentsFilterValues => {
	const toDate = new Date();
	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() - 6);

	return {
		fromDate: fromDate.toISOString(),
		toDate: toDate.toISOString(),
		patientCode: '',
		user: '',
	};
};
