import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {
	type FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';

export interface GregorianDatePickerProps {
	year: number;
	month: number;
	day: number;
	onChange: (year: number, month: number, day: number) => void;
	disableFuture?: boolean;
	disabled?: boolean;
}

const GREGORIAN_MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const getDaysInMonth = (year: number, month: number): number => {
	return new Date(year, month, 0).getDate();
};

const GregorianDatePicker: FunctionComponent<GregorianDatePickerProps> = ({
	year,
	month,
	day,
	onChange,
	disableFuture = false,
	disabled = false,
}) => {
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth() + 1;
	const currentDay = now.getDate();
	const startYear = 1900;

	const [selectedYear, setSelectedYear] = useState(year);
	const [selectedMonth, setSelectedMonth] = useState(month);
	const [selectedDay, setSelectedDay] = useState(day);

	useEffect(() => {
		setSelectedYear(year);
		setSelectedMonth(month);
		setSelectedDay(day);
	}, [year, month, day]);

	const maxDay = getDaysInMonth(selectedYear, selectedMonth);

	const handleYearChange = useCallback(
		(newYear: number) => {
			setSelectedYear(newYear);
			const newMaxDay = getDaysInMonth(newYear, selectedMonth);
			const newDay = Math.min(selectedDay, newMaxDay);
			onChange(newYear, selectedMonth, newDay);
		},
		[selectedMonth, selectedDay, onChange],
	);

	const handleMonthChange = useCallback(
		(newMonth: number) => {
			setSelectedMonth(newMonth);
			const newMaxDay = getDaysInMonth(selectedYear, newMonth);
			const newDay = Math.min(selectedDay, newMaxDay);
			onChange(selectedYear, newMonth, newDay);
		},
		[selectedYear, selectedDay, onChange],
	);

	const handleDayChange = useCallback(
		(newDay: number) => {
			setSelectedDay(newDay);
			onChange(selectedYear, selectedMonth, newDay);
		},
		[selectedYear, selectedMonth, onChange],
	);

	const yearOptions = useMemo(() => {
		const endYear = disableFuture ? currentYear : currentYear + 50;
		const options = [];
		for (let y = startYear; y <= endYear; y++) {
			options.push(y);
		}
		return options;
	}, [disableFuture, currentYear]);

	const monthOptions = useMemo(() => {
		const isCurrentYear = selectedYear === currentYear;
		return GREGORIAN_MONTHS.map((name, index) => ({
			value: index + 1,
			label: `${index + 1} - ${name}`,
			disabled: disableFuture && isCurrentYear && index + 1 > currentMonth,
		}));
	}, [selectedYear, disableFuture, currentYear, currentMonth]);

	const dayOptions = useMemo(() => {
		const isCurrentYear = selectedYear === currentYear;
		const isCurrentMonth = selectedMonth === currentMonth;
		const options = [];
		for (let d = 1; d <= maxDay; d++) {
			const isFutureDay =
				disableFuture && isCurrentYear && isCurrentMonth && d > currentDay;
			options.push({ value: d, disabled: isFutureDay });
		}
		return options;
	}, [
		selectedYear,
		selectedMonth,
		maxDay,
		disableFuture,
		currentYear,
		currentMonth,
		currentDay,
	]);

	const menuProps = {
		PaperProps: {
			sx: { maxHeight: 300 },
		},
	};

	return (
		<div
			className="gregorianDatePicker"
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '8px',
			}}
		>
			<FormControl size="small" disabled={disabled}>
				<InputLabel id="gregorian-year-label">Year</InputLabel>
				<Select
					labelId="gregorian-year-label"
					value={selectedYear}
					label="Year"
					onChange={(e) => handleYearChange(Number(e.target.value))}
					aria-label="Gregorian year"
					MenuProps={menuProps}
				>
					{yearOptions.map((y) => (
						<MenuItem key={y} value={y}>
							{y}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl size="small" disabled={disabled}>
				<InputLabel id="gregorian-month-label">Month</InputLabel>
				<Select
					labelId="gregorian-month-label"
					value={selectedMonth}
					label="Month"
					onChange={(e) => handleMonthChange(Number(e.target.value))}
					aria-label="Gregorian month"
					MenuProps={menuProps}
				>
					{monthOptions.map((m) => (
						<MenuItem key={m.value} value={m.value} disabled={m.disabled}>
							{m.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl size="small" disabled={disabled}>
				<InputLabel id="gregorian-day-label">Day</InputLabel>
				<Select
					labelId="gregorian-day-label"
					value={selectedDay}
					label="Day"
					onChange={(e) => handleDayChange(Number(e.target.value))}
					aria-label="Gregorian day"
					MenuProps={menuProps}
				>
					{dayOptions.map((d) => (
						<MenuItem key={d.value} value={d.value} disabled={d.disabled}>
							{d.value}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
};

export default GregorianDatePicker;
