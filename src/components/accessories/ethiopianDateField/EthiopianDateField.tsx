import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import {
	type FunctionComponent,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
	ethiopianToGregorian,
	formatEthiopianDate,
	getCurrentEthiopianDate,
	gregorianToEthiopian,
	isValidEthiopianDate,
} from '../../../libraries/ethiopianCalendar/ethiopianCalendar';
import { FIELD_VALIDATION } from '../../../types';
import DateInputDialog, { type CalendarMode } from './DateInputDialog';
import type { IEthiopianDateFieldProps } from './types';

const EthiopianDateField: FunctionComponent<IEthiopianDateFieldProps> = ({
	fieldName,
	fieldValue,
	disableFuture = false,
	disabled = false,
	errorText,
	label,
	required = FIELD_VALIDATION.IDLE,
	setFieldValue,
}) => {
	const { t } = useTranslation();
	const [displayMode, setDisplayMode] = useState<CalendarMode>('ethiopian');
	const [dialogOpen, setDialogOpen] = useState(false);

	const [ethiopianYear, setEthiopianYear] = useState<number | null>(null);
	const [ethiopianMonth, setEthiopianMonth] = useState<number | null>(null);
	const [ethiopianDay, setEthiopianDay] = useState<number | null>(null);

	const [gregorianYear, setGregorianYear] = useState<number | null>(null);
	const [gregorianMonth, setGregorianMonth] = useState<number | null>(null);
	const [gregorianDay, setGregorianDay] = useState<number | null>(null);

	useEffect(() => {
		if (fieldValue && fieldValue !== '') {
			try {
				const date = new Date(fieldValue);
				if (!Number.isNaN(date.getTime())) {
					const ethDate = gregorianToEthiopian(
						date.getFullYear(),
						date.getMonth() + 1,
						date.getDate(),
					);
					setEthiopianYear(ethDate.year);
					setEthiopianMonth(ethDate.month);
					setEthiopianDay(ethDate.day);
					setGregorianYear(date.getFullYear());
					setGregorianMonth(date.getMonth() + 1);
					setGregorianDay(date.getDate());
				}
			} catch {
				setEthiopianYear(null);
				setEthiopianMonth(null);
				setEthiopianDay(null);
				setGregorianYear(null);
				setGregorianMonth(null);
				setGregorianDay(null);
			}
		} else {
			setEthiopianYear(null);
			setEthiopianMonth(null);
			setEthiopianDay(null);
			setGregorianYear(null);
			setGregorianMonth(null);
			setGregorianDay(null);
		}
	}, [fieldValue]);

	const handleConfirm = useCallback(
		(year: number, month: number, day: number) => {
			setDialogOpen(false);

			if (displayMode === 'ethiopian') {
				setEthiopianYear(year);
				setEthiopianMonth(month);
				setEthiopianDay(day);

				if (isValidEthiopianDate(year, month, day)) {
					const gregorianDate = ethiopianToGregorian(year, month, day);
					setGregorianYear(gregorianDate.year);
					setGregorianMonth(gregorianDate.month);
					setGregorianDay(gregorianDate.day);

					const dateObj = new Date(
						gregorianDate.year,
						gregorianDate.month - 1,
						gregorianDate.day,
					);
					const timestamp = dateObj.toISOString();
					
					if (setFieldValue) {
						setFieldValue(fieldName, timestamp);
					} else {
						const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
							HTMLInputElement.prototype,
							'value',
						)?.set;
						const input = document.querySelector(`input[name="${fieldName}"]`);
						if (input && nativeInputValueSetter) {
							nativeInputValueSetter.call(input, timestamp);
							input.dispatchEvent(new Event('input', { bubbles: true }));
						}
					}
				}
			} else {
				setGregorianYear(year);
				setGregorianMonth(month);
				setGregorianDay(day);

				const ethDate = gregorianToEthiopian(year, month, day);
				setEthiopianYear(ethDate.year);
				setEthiopianMonth(ethDate.month);
				setEthiopianDay(ethDate.day);

				const dateObj = new Date(year, month - 1, day);
				const timestamp = dateObj.toISOString();
				
				if (setFieldValue) {
					setFieldValue(fieldName, timestamp);
				} else {
					const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
						HTMLInputElement.prototype,
						'value',
					)?.set;
					const input = document.querySelector(`input[name="${fieldName}"]`);
					if (input && nativeInputValueSetter) {
						nativeInputValueSetter.call(input, timestamp);
						input.dispatchEvent(new Event('input', { bubbles: true }));
					}
				}
			}
		},
		[displayMode, fieldName, setFieldValue],
	);

	const handleModeChange = useCallback((newMode: CalendarMode) => {
		setDisplayMode(newMode);
	}, []);

	const displayLabel =
		required === FIELD_VALIDATION.SUGGESTED ? `${label} **` : label;

	const ethMonths = t('ethiopianCalendar.months.ethiopian', { returnObjects: true }) as string[];
	const gregMonths = t('ethiopianCalendar.months.gregorian', { returnObjects: true }) as string[];

	const formatAbbreviatedEthiopian = (
		y: number,
		m: number,
		d: number,
	): string => {
		return `${ethMonths[m - 1].substring(0, 3)} ${d}, ${y}`;
	};

	const formatAbbreviatedGregorian = (
		y: number,
		m: number,
		d: number,
	): string => {
		return `${gregMonths[m - 1].substring(0, 3)} ${d}, ${y}`;
	};

	const displayValue =
		ethiopianYear !== null && ethiopianMonth !== null && ethiopianDay !== null
			? displayMode === 'ethiopian'
				? formatAbbreviatedEthiopian(ethiopianYear, ethiopianMonth, ethiopianDay)
				: formatAbbreviatedGregorian(gregorianYear!, gregorianMonth!, gregorianDay!)
			: '';

	const formattedEthiopian =
		ethiopianYear !== null && ethiopianMonth !== null && ethiopianDay !== null
			? formatEthiopianDate(ethiopianYear, ethiopianMonth, ethiopianDay, 'english')
			: '';

	const formattedGregorian =
		gregorianYear !== null && gregorianMonth !== null && gregorianDay !== null
			? `${gregorianYear}-${String(gregorianMonth).padStart(2, '0')}-${String(gregorianDay).padStart(2, '0')}`
			: '';

	const convertedDate =
		ethiopianYear !== null && gregorianYear !== null
			? displayMode === 'ethiopian'
				? formattedGregorian
				: formattedEthiopian
			: '';
	const convertedLabel =
		displayMode === 'ethiopian'
			? t('ethiopianCalendar.preview.gregorian')
			: t('ethiopianCalendar.preview.ethiopian');

	return (
		<div className="ethiopianDateField">
			<FormControl
				fullWidth
				error={Boolean(errorText)}
				disabled={disabled}
				variant="outlined"
				margin="dense"
			>
			<InputLabel shrink sx={{background: '#fff'}}>{displayLabel} *</InputLabel>
			<div className="ethiopianDateField__compactRow"
				style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8px'}}>
					<Select
						size="small"
						value={displayMode}
						onChange={(e) => handleModeChange(e.target.value as CalendarMode)}
						disabled={disabled}
						sx={{ minWidth: 100 }}
					>
						<MenuItem value="ethiopian">{t('ethiopianCalendar.mode.ethiopian')}</MenuItem>
						<MenuItem value="gregorian">{t('ethiopianCalendar.mode.gregorian')}</MenuItem>
					</Select>
					<TextField
						size="small"
						value={displayValue}
						error={Boolean(errorText)}
						placeholder={t('common.selectdate')}
						InputProps={{ readOnly: true }}
						onClick={() => !disabled && setDialogOpen(true)}
						sx={{ flex: 1, cursor: disabled ? 'default' : 'pointer' }}
						disabled={disabled}
						id={fieldName}
					/>
				</div>
				{errorText && <FormHelperText>{errorText}</FormHelperText>}
				<div className="ethiopianDateField__convertedDate">
					{convertedLabel}: {convertedDate}
				</div>
			</FormControl>

			<DateInputDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				onConfirm={handleConfirm}
				year={displayMode === 'ethiopian' ? (ethiopianYear ?? getCurrentEthiopianDate().year) : (gregorianYear ?? new Date().getFullYear())}
				month={displayMode === 'ethiopian' ? (ethiopianMonth ?? getCurrentEthiopianDate().month) : (gregorianMonth ?? new Date().getMonth() + 1)}
				day={displayMode === 'ethiopian' ? (ethiopianDay ?? getCurrentEthiopianDate().day) : (gregorianDay ?? new Date().getDate())}
				mode={displayMode}
				disableFuture={disableFuture}
				disabled={disabled}
			/>
		</div>
	);
};

export default EthiopianDateField;
