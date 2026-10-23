import type { TFunction } from 'i18next';

export const resolveApiErrorMessage = (
	error: any,
	t: TFunction,
	fallbackKey = 'common.somethingwrong',
): string => {
	if (!error) return t(fallbackKey);

	if (typeof error === 'string') {
		if (error.toLowerCase().includes('forbidden')) {
			return t('errors.forbidden');
		}
		return t(error);
	}

	const status =
		error.status ??
		error.response?.status ??
		error.data?.status ??
		error.response?.data?.status;

	const message =
		error.response?.data?.message ??
		error.response?.data?.error ??
		error.data?.message ??
		error.data?.error ??
		error.response?.message ??
		error.error ??
		error.message;

	if (
		status === 403 ||
		(typeof message === 'string' && message.toLowerCase().includes('forbidden'))
	) {
		return t('errors.forbidden');
	}

	if (
		typeof message === 'string' &&
		message.trim().length > 0 &&
		message !== 'ajax error'
	) {
		return t(message);
	}

	return t(fallbackKey);
};
