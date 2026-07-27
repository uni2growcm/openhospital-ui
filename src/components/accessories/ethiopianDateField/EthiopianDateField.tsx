import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import {
	type FunctionComponent,
	useCallback,
	useEffect,
	useState,
} from 'react';
import {
	ethiopianToGregorian,
	formatEthiopianDate,
	gregorianToEthiopian,
	isValidEthiopianDate,
} from '../../../libraries/ethiopianCalendar/ethiopianCalendar';
import { FIELD_VALIDATION } from '../../../types';
import EthiopianDatePicker from './EthiopianDatePicker';
import type { IEthiopianDateFieldProps } from './types';

const EthiopianDateField: FunctionComponent<IEthiopianDateFieldProps> = ({
	fieldName,
	fieldValue,
	disableFuture = false,
	disabled = false,
	errorText,
	label,
	required = FIELD_VALIDATION.IDLE,
}) => {
	const [ethiopianYear, setEthiopianYear] = useState(2016);
	const [ethiopianMonth, setEthiopianMonth] = useState(1);
	const [ethiopianDay, setEthiopianDay] = useState(1);

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
				}
			} catch {
				setEthiopianYear(2016);
				setEthiopianMonth(1);
				setEthiopianDay(1);
			}
		}
	}, [fieldValue]);

	const handleDateChange = useCallback(
		(year: number, month: number, day: number) => {
			setEthiopianYear(year);
			setEthiopianMonth(month);
			setEthiopianDay(day);

			if (isValidEthiopianDate(year, month, day)) {
				const gregorianDate = ethiopianToGregorian(year, month, day);
				const dateObj = new Date(
					gregorianDate.year,
					gregorianDate.month - 1,
					gregorianDate.day,
				);
				const timestamp = dateObj.toISOString();
				// Dispatch event for formik compatibility
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
		},
		[fieldName],
	);

	const displayLabel =
		required === FIELD_VALIDATION.SUGGESTED ? `${label} **` : label;

	const formattedDate = formatEthiopianDate(
		ethiopianYear,
		ethiopianMonth,
		ethiopianDay,
		'english',
	);

	return (
		<div className="ethiopianDateField">
			<FormControl
				fullWidth
				error={Boolean(errorText)}
				disabled={disabled}
				variant="outlined"
				margin="dense"
			>
				<InputLabel shrink>{displayLabel}</InputLabel>
				<div style={{ paddingTop: '8px' }}>
					<EthiopianDatePicker
						year={ethiopianYear}
						month={ethiopianMonth}
						day={ethiopianDay}
						onChange={handleDateChange}
						disableFuture={disableFuture}
						disabled={disabled}
					/>
				</div>
				{errorText && <FormHelperText>{errorText}</FormHelperText>}
				<div
					style={{
						fontSize: '0.75rem',
						color: 'rgba(0, 0, 0, 0.6)',
						marginTop: '4px',
					}}
				>
					{formattedDate}
				</div>
			</FormControl>
		</div>
	);
};

export default EthiopianDateField;
