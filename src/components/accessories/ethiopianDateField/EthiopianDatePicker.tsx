import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {
	type FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	ETHIOPIAN_MONTHS_AMHARIC,
	getCurrentEthiopianDate,
	getEthiopianMonthDays,
	isValidEthiopianDate,
} from '../../../libraries/ethiopianCalendar/ethiopianCalendar';
import type { EthiopianDatePickerProps } from './types';

const EthiopianDatePicker: FunctionComponent<EthiopianDatePickerProps> = ({
	year,
	month,
	day,
	onChange,
	disableFuture = false,
	disabled = false,
	disableMonthChange = false,
}) => {
	const currentEthiopianDate = getCurrentEthiopianDate();
	const startYear = 1900;

	const [selectedYear, setSelectedYear] = useState(year);
	const [selectedMonth, setSelectedMonth] = useState(month);
	const [selectedDay, setSelectedDay] = useState(day);

	useEffect(() => {
		setSelectedYear(year);
		setSelectedMonth(month);
		setSelectedDay(day);
	}, [year, month, day]);

	const maxDay = getEthiopianMonthDays(selectedYear, selectedMonth);

	const handleYearChange = useCallback(
		(newYear: number) => {
			setSelectedYear(newYear);
			const newMaxDay = getEthiopianMonthDays(newYear, selectedMonth);
			const newDay = Math.min(selectedDay, newMaxDay);
			if (isValidEthiopianDate(newYear, selectedMonth, newDay)) {
				onChange(newYear, selectedMonth, newDay);
			}
		},
		[selectedMonth, selectedDay, onChange],
	);

	const handleMonthChange = useCallback(
		(newMonth: number) => {
			setSelectedMonth(newMonth);
			const newMaxDay = getEthiopianMonthDays(selectedYear, newMonth);
			const newDay = Math.min(selectedDay, newMaxDay);
			if (isValidEthiopianDate(selectedYear, newMonth, newDay)) {
				onChange(selectedYear, newMonth, newDay);
			}
		},
		[selectedYear, selectedDay, onChange],
	);

	const handleDayChange = useCallback(
		(newDay: number) => {
			setSelectedDay(newDay);
			if (isValidEthiopianDate(selectedYear, selectedMonth, newDay)) {
				onChange(selectedYear, selectedMonth, newDay);
			}
		},
		[selectedYear, selectedMonth, onChange],
	);

	const yearOptions = useMemo(() => {
		const endYear = disableFuture
			? currentEthiopianDate.year
			: currentEthiopianDate.year + 50;
		const options = [];
		for (let y = startYear; y <= endYear; y++) {
			options.push(y);
		}
		return options;
	}, [disableFuture, currentEthiopianDate.year]);

	const monthOptions = useMemo(() => {
		const isCurrentYear = selectedYear === currentEthiopianDate.year;
		return ETHIOPIAN_MONTHS_AMHARIC.map((name, index) => ({
			value: index + 1,
			label: `${index + 1} - ${name}`,
			disabled:
				disableFuture &&
				isCurrentYear &&
				index + 1 > currentEthiopianDate.month,
		}));
	}, [selectedYear, disableFuture, currentEthiopianDate]);

	const dayOptions = useMemo(() => {
		const isCurrentYear = selectedYear === currentEthiopianDate.year;
		const isCurrentMonth = selectedMonth === currentEthiopianDate.month;
		const options = [];
		for (let d = 1; d <= maxDay; d++) {
			const isFutureDay =
				disableFuture &&
				isCurrentYear &&
				isCurrentMonth &&
				d > currentEthiopianDate.day;
			options.push({ value: d, disabled: isFutureDay });
		}
		return options;
	}, [
		selectedYear,
		selectedMonth,
		maxDay,
		disableFuture,
		currentEthiopianDate,
	]);

	const menuProps = {
		PaperProps: {
			sx: { maxHeight: 300 },
		},
	};

	return (
		<div
			className="ethiopianDatePicker"
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '8px',
			}}
		>
			<FormControl
				size="small"
				className="ethiopianDatePicker__select"
				disabled={disabled}
			>
				<InputLabel id={`${year}-label`}>Year</InputLabel>
				<Select
					labelId={`${year}-label`}
					value={selectedYear}
					label="Year"
					onChange={(e) => handleYearChange(Number(e.target.value))}
					aria-label="Ethiopian year"
					MenuProps={menuProps}
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
				className="ethiopianDatePicker__select ethiopianDatePicker__select--month"
				disabled={disabled}
			>
				<InputLabel id={`${month}-label`}>Month</InputLabel>
				<Select
					labelId={`${month}-label`}
					value={selectedMonth}
					label="Month"
					onChange={(e) => handleMonthChange(Number(e.target.value))}
					disabled={disableMonthChange}
					aria-label="Ethiopian month"
					MenuProps={menuProps}
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

			<FormControl
				size="small"
				className="ethiopianDatePicker__select"
				disabled={disabled}
			>
				<InputLabel id={`${day}-label`}>Day</InputLabel>
				<Select
					labelId={`${day}-label`}
					value={selectedDay}
					label="Day"
					onChange={(e) => handleDayChange(Number(e.target.value))}
					aria-label="Ethiopian day"
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

export default EthiopianDatePicker;
