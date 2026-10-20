import type { TFunction } from 'i18next';

export const resolveApiErrorMessage = (
	error: any,
	t: TFunction,
	fallbackKey = 'common.somethingwrong',
): string => {
	if (!error) return t(fallbackKey);

	const status = error.status ?? error.response?.status;
	const message = error.message ?? error.response?.message ?? error.error;

	if (status === 403 || message === 'Forbidden') {
		return t('errors.forbidden');
	}

	if (typeof message === 'string' && message.trim().length > 0) {
		return t(message);
	}

	return t(fallbackKey);
};
