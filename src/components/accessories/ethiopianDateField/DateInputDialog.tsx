import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';
import {
	type FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
	ethiopianToGregorian,
	getCurrentEthiopianDate,
	getEthiopianMonthDays,
	gregorianToEthiopian,
} from '../../../libraries/ethiopianCalendar/ethiopianCalendar';

const getDaysInMonth = (year: number, month: number): number => {
	return new Date(year, month, 0).getDate();
};

export type CalendarMode = 'ethiopian' | 'gregorian';

interface DateInputDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (year: number, month: number, day: number) => void;
	year: number;
	month: number;
	day: number;
	mode: CalendarMode;
	disableFuture?: boolean;
	disabled?: boolean;
}

const DateInputDialog: FunctionComponent<DateInputDialogProps> = ({
	open,
	onClose,
	onConfirm,
	year,
	month,
	day,
	mode,
	disableFuture = false,
	disabled = false,
}) => {
	const { t } = useTranslation();
	const currentEthiopianDate = getCurrentEthiopianDate();
	const now = new Date();
	const currentGregorianYear = now.getFullYear();
	const currentGregorianMonth = now.getMonth() + 1;
	const currentGregorianDay = now.getDate();

	const [localYear, setLocalYear] = useState(year);
	const [localMonth, setLocalMonth] = useState(month);
	const [localDay, setLocalDay] = useState(day);

	useEffect(() => {
		if (open) {
			setLocalYear(year);
			setLocalMonth(month);
			setLocalDay(day);
		}
	}, [open, year, month, day]);

	const maxDay = useMemo(() => {
		if (mode === 'ethiopian') {
			return getEthiopianMonthDays(localYear, localMonth);
		}
		return getDaysInMonth(localYear, localMonth);
	}, [mode, localYear, localMonth]);

	const handleYearChange = useCallback(
		(newYear: number) => {
			setLocalYear(newYear);
			const newMaxDay =
				mode === 'ethiopian'
					? getEthiopianMonthDays(newYear, localMonth)
					: getDaysInMonth(newYear, localMonth);
			setLocalDay((prev) => Math.min(prev, newMaxDay));
		},
		[mode, localMonth],
	);

	const handleMonthChange = useCallback(
		(newMonth: number) => {
			setLocalMonth(newMonth);
			const newMaxDay =
				mode === 'ethiopian'
					? getEthiopianMonthDays(localYear, newMonth)
					: getDaysInMonth(localYear, newMonth);
			setLocalDay((prev) => Math.min(prev, newMaxDay));
		},
		[mode, localYear],
	);

	const handleConfirm = useCallback(() => {
		onConfirm(localYear, localMonth, localDay);
	}, [localYear, localMonth, localDay, onConfirm]);

	const ethMonths = useMemo(
		() => t('ethiopianCalendar.months.ethiopian', { returnObjects: true }) as string[],
		[t],
	);

	const gregMonths = useMemo(
		() => t('ethiopianCalendar.months.gregorian', { returnObjects: true }) as string[],
		[t],
	);

	const convertedPreview = useMemo(() => {
		try {
			if (mode === 'ethiopian') {
				const gregorian = ethiopianToGregorian(localYear, localMonth, localDay);
				return `${gregorian.year}-${String(gregorian.month).padStart(2, '0')}-${String(gregorian.day).padStart(2, '0')}`;
			}
			const ethiopian = gregorianToEthiopian(localYear, localMonth, localDay);
			return `${ethMonths[ethiopian.month - 1]} ${ethiopian.day}, ${ethiopian.year}`;
		} catch {
			return '';
		}
	}, [mode, localYear, localMonth, localDay, ethMonths]);

	const convertedLabel = useMemo(
		() =>
			mode === 'ethiopian'
				? t('ethiopianCalendar.preview.gregorian')
				: t('ethiopianCalendar.preview.ethiopian'),
		[mode, t],
	);

	const yearOptions = useMemo(() => {
		const startYear = 1900;
		let endYear: number;
		if (mode === 'ethiopian') {
			endYear = disableFuture
				? currentEthiopianDate.year
				: currentEthiopianDate.year + 50;
		} else {
			endYear = disableFuture
				? currentGregorianYear
				: currentGregorianYear + 50;
		}
		const options = [];
		for (let y = startYear; y <= endYear; y++) {
			options.push(y);
		}
		return options;
	}, [mode, disableFuture, currentEthiopianDate.year, currentGregorianYear]);

	const monthOptions = useMemo(() => {
		if (mode === 'ethiopian') {
			const isCurrentYear = localYear === currentEthiopianDate.year;
			return ethMonths.map((name, index) => ({
				value: index + 1,
				label: `${index + 1} - ${name}`,
				disabled:
					disableFuture &&
					isCurrentYear &&
					index + 1 > currentEthiopianDate.month,
			}));
		}
		const isCurrentYear = localYear === currentGregorianYear;
		return gregMonths.map((name, index) => ({
			value: index + 1,
			label: `${index + 1} - ${name}`,
			disabled:
				disableFuture && isCurrentYear && index + 1 > currentGregorianMonth,
		}));
	}, [
		mode,
		localYear,
		disableFuture,
		currentEthiopianDate,
		currentGregorianYear,
		currentGregorianMonth,
		ethMonths,
		gregMonths,
	]);

	const dayOptions = useMemo(() => {
		const options = [];
		for (let d = 1; d <= maxDay; d++) {
			let isFutureDay = false;
			if (disableFuture) {
				if (mode === 'ethiopian') {
					isFutureDay =
						localYear === currentEthiopianDate.year &&
						localMonth === currentEthiopianDate.month &&
						d > currentEthiopianDate.day;
				} else {
					isFutureDay =
						localYear === currentGregorianYear &&
						localMonth === currentGregorianMonth &&
						d > currentGregorianDay;
				}
			}
			options.push({ value: d, disabled: isFutureDay });
		}
		return options;
	}, [
		mode,
		maxDay,
		localYear,
		localMonth,
		disableFuture,
		currentEthiopianDate,
		currentGregorianYear,
		currentGregorianMonth,
		currentGregorianDay,
	]);

	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<DialogTitle>{t('ethiopianCalendar.dialog.title')}</DialogTitle>
			<DialogContent>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr 1fr',
						gap: '16px',
						paddingTop: '8px',
					}}
				>
					<FormControl size="small" disabled={disabled}>
						<InputLabel id="dialog-year-label">
							{t('ethiopianCalendar.dialog.year')}
						</InputLabel>
						<Select
							labelId="dialog-year-label"
							value={localYear}
							label={t('ethiopianCalendar.dialog.year')}
							onChange={(e) => handleYearChange(Number(e.target.value))}
						>
							{yearOptions.map((y) => (
								<MenuItem key={y} value={y}>
									{y}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl
						size="small"
						disabled={disabled}
						sx={{ fontFamily: 'Noto Sans Ethiopic, sans-serif !important' }}
					>
						<InputLabel id="dialog-month-label">
							{t('ethiopianCalendar.dialog.month')}
						</InputLabel>
						<Select
							labelId="dialog-month-label"
							value={localMonth}
							label={t('ethiopianCalendar.dialog.month')}
							onChange={(e) => handleMonthChange(Number(e.target.value))}
							sx={{ fontFamily: 'Noto Sans Ethiopic, sans-serif !important' }}
						>
							{monthOptions.map((m) => (
								<MenuItem
									key={m.value}
									value={m.value}
									disabled={m.disabled}
									sx={{ fontFamily: 'Noto Sans Ethiopic, sans-serif !important' }}
								>
									{m.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl size="small" disabled={disabled}>
						<InputLabel id="dialog-day-label">
							{t('ethiopianCalendar.dialog.day')}
						</InputLabel>
						<Select
							labelId="dialog-day-label"
							value={localDay}
							label={t('ethiopianCalendar.dialog.day')}
							onChange={(e) => setLocalDay(Number(e.target.value))}
						>
							{dayOptions.map((d) => (
								<MenuItem key={d.value} value={d.value} disabled={d.disabled}>
									{d.value}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

				{convertedPreview && (
					<div
						style={{
							marginTop: '16px',
							padding: '12px',
							border: '1px solid rgba(0, 0, 0, 0.12)',
							borderRadius: '4px',
							backgroundColor: 'rgba(0, 0, 0, 0.02)',
							textAlign: 'center',
						}}
					>
						<Typography variant="body2" color="text.secondary">
							{convertedLabel}: {convertedPreview}
						</Typography>
					</div>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>{t('ethiopianCalendar.dialog.cancel')}</Button>
				<Button onClick={handleConfirm} variant="contained">
					{t('ethiopianCalendar.dialog.confirm')}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DateInputDialog;
