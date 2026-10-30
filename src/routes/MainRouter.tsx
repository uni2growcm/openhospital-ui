import i18n from 'i18next';
import type React from 'react';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { getUserSettings } from '../state/main';
import { useAppRouter } from './router';

export const MainRouter: React.FC = () => {
	const router = useAppRouter();
	const dispatch = useAppDispatch();
	const status = useAppSelector(
		(state) => state.main.authentication.status ?? '',
	);
	const settings = useAppSelector((state) => state.main.settings.data);

	useEffect(() => {
		if (status === 'SUCCESS') {
			dispatch(getUserSettings());
		}
	}, [dispatch, status]);

	useEffect(() => {
		const language = settings?.find(
			(setting) => setting.configName === 'language',
		)?.configValue;

		if (
			language &&
			i18n.language?.split('-')[0] !== language &&
			i18n.hasResourceBundle(language, 'translation')
		) {
			i18n.changeLanguage(language);
		}
	}, [settings]);

	return <RouterProvider router={router} />;
};
