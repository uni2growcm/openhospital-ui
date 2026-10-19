import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
	csCZ,
	deDE,
	esES,
	frFR,
	itIT,
	enUS as pickerTextEnUS,
	zhCN as pickerTextZhCN,
	ptPT,
} from '@mui/x-date-pickers/locales';
import type { Locale } from 'date-fns';
import { ar, cs, de, enUS, es, fr, it, pt, sq, zhCN } from 'date-fns/locale';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useState } from 'react';
import { initReactI18next } from 'react-i18next';
import './App.scss';
import { LangContext } from './libraries/langContext/langContext';
import resources from './resources';
import { I18N_FALLBACK_LNG } from './resources/config';
import { MainRouter } from './routes';

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources,
		fallbackLng: I18N_FALLBACK_LNG,
		supportedLngs: ['en', 'fr', 'it', 'sq', 'de'],
		interpolation: {
			escapeValue: false,
		},
	});

// date-fns has no locale for every language the app ships translations for
// (e.g. Amharic, Swahili, Tigrinya) — those fall back to English calendars.
const datePickerLocales: Record<string, Locale> = {
	ar,
	cs,
	de,
	en: enUS,
	es,
	fr,
	it,
	pt,
	sq,
	zh: zhCN,
};

// Separate from the date-fns locale above: this localizes the picker's own
// UI strings ("Previous month", "Cancel", ...). MUI ships fewer locales than
// date-fns, so this has no entry for Albanian/Arabic — falls back to English.
const datePickerTexts: Record<
	string,
	(typeof frFR)['components']['MuiLocalizationProvider']['defaultProps']['localeText']
> = {
	cs: csCZ.components.MuiLocalizationProvider.defaultProps.localeText,
	de: deDE.components.MuiLocalizationProvider.defaultProps.localeText,
	en: pickerTextEnUS.components.MuiLocalizationProvider.defaultProps.localeText,
	es: esES.components.MuiLocalizationProvider.defaultProps.localeText,
	fr: frFR.components.MuiLocalizationProvider.defaultProps.localeText,
	it: itIT.components.MuiLocalizationProvider.defaultProps.localeText,
	pt: ptPT.components.MuiLocalizationProvider.defaultProps.localeText,
	zh: pickerTextZhCN.components.MuiLocalizationProvider.defaultProps.localeText,
};

const App = () => {
	const [, setLang] = useState(i18n.language);
	const changeLang = (l: string) => {
		i18n.changeLanguage(l).then(() => {
			setLang(l);
		});
	};

	const pickerTheme = createTheme({
		palette: {
			primary: {
				main: '#fc1812',
				contrastText: '#fff',
			},
			secondary: {
				light: '#444444',
				main: '#444444',
				contrastText: '#fff',
			},
		},
	});

	const currentLang = i18n.language.split('-')[0];
	const datePickerLocale = datePickerLocales[currentLang] ?? enUS;
	const datePickerText =
		datePickerTexts[currentLang] ??
		pickerTextEnUS.components.MuiLocalizationProvider.defaultProps.localeText;

	return (
		<div className="App">
			<LocalizationProvider
				dateAdapter={AdapterDateFns}
				adapterLocale={datePickerLocale}
				localeText={datePickerText}
			>
				<ThemeProvider theme={pickerTheme}>
					<CssBaseline />
					<LangContext.Provider value={{ changeLang }}>
						<MainRouter />
					</LangContext.Provider>
				</ThemeProvider>
			</LocalizationProvider>
		</div>
	);
};

export default App;
