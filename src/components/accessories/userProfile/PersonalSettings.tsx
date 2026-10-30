import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	type SelectChangeEvent,
} from '@mui/material';
import { type FunctionComponent, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import availableLanguages from '../../../customization/available-languages.json';
import type { UserSettingDTO } from '../../../generated';
import { useAppDispatch, useAppSelector } from '../../../libraries/hooks/redux';
import { LangContext } from '../../../libraries/langContext/langContext';
import { saveUserSettings, saveUserSettingsReset } from '../../../state/main';
import InfoBox from '../infoBox/InfoBox';
import './styles.scss';
import type { IPersonalSettingsProps } from './types';

const languageLabels: Record<string, string> = {
	en: 'English',
	it: 'Italiano',
	de: 'Deutsch',
	fr: 'Français',
	es: 'Español',
	pt: 'Português',
	ar: 'عرب',
	sw: 'Svenska',
	am: 'አማርኛ',
	cs: 'čeština',
	sq: 'Shqiptar',
	zh: '中国人',
};

export const PersonalSettings: FunctionComponent<IPersonalSettingsProps> = ({
	userName,
}) => {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();
	const { changeLang } = useContext(LangContext);

	const settings = useAppSelector((state) => state.main.settings.data ?? []);
	const saveStatus = useAppSelector(
		(state) => state.main.saveSettings.status ?? 'IDLE',
	);
	const saveError = useAppSelector((state) => state.main.saveSettings.error);

	const languages = availableLanguages.availableLanguages.length
		? availableLanguages.availableLanguages
		: Object.keys(languageLabels);

	const currentLanguage = i18n.language?.split('-')[0] ?? 'en';
	const selectedLanguage = languages.includes(currentLanguage)
		? currentLanguage
		: languages[0];

	useEffect(
		() => () => {
			dispatch(saveUserSettingsReset());
		},
		[dispatch],
	);

	const handleLanguageChange = (event: SelectChangeEvent) => {
		const language = event.target.value;
		changeLang(language);

		const existingSetting = settings.find(
			(setting) => setting.configName === 'language',
		);

		const userSetting: UserSettingDTO = existingSetting
			? { ...existingSetting, configValue: language }
			: ({
					configName: 'language',
					configValue: language,
					user: userName,
				} as UserSettingDTO);

		dispatch(saveUserSettings(userSetting));
	};

	return (
		<section className="userProfileSection" data-cy="user-profile-settings">
			<div className="userProfileSection__header">
				<h3>{t('profile.settings')}</h3>
				<p>{t('profile.settingsDescription')}</p>
			</div>
			<div className="userProfileSettings">
				<FormControl variant="outlined" size="small">
					<InputLabel id="profile-language-label">
						{t('profile.language')}
					</InputLabel>
					<Select
						labelId="profile-language-label"
						id="profile-language"
						value={selectedLanguage}
						label={t('profile.language')}
						onChange={handleLanguageChange}
						disabled={saveStatus === 'LOADING'}
					>
						{languages.map((language) => (
							<MenuItem key={language} value={language}>
								{languageLabels[language] ?? language}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				{saveStatus === 'SUCCESS' && (
					<div className="userProfileSettings__success">
						{t('profile.languageUpdated')}
					</div>
				)}
				{saveStatus === 'FAIL' && (
					<InfoBox
						type="error"
						message={saveError?.message ?? t('common.somethingwrong')}
					/>
				)}
			</div>
		</section>
	);
};
