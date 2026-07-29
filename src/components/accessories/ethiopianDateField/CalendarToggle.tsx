import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { FunctionComponent } from 'react';

export type CalendarMode = 'ethiopian' | 'gregorian';

interface CalendarToggleProps {
	value: CalendarMode;
	onChange: (mode: CalendarMode) => void;
	disabled?: boolean;
}

const CalendarToggle: FunctionComponent<CalendarToggleProps> = ({
	value,
	onChange,
	disabled = false,
}) => {
	return (
		<FormControl size="small" sx={{ minWidth: 120 }} disabled={disabled}>
			<InputLabel id="calendar-mode-label">Calendar</InputLabel>
			<Select
				labelId="calendar-mode-label"
				value={value}
				label="Calendar"
				onChange={(e) => onChange(e.target.value as CalendarMode)}
				aria-label="Calendar mode"
			>
				<MenuItem value="ethiopian">Ethiopian</MenuItem>
				<MenuItem value="gregorian">Gregorian</MenuItem>
			</Select>
		</FormControl>
	);
};

export default CalendarToggle;
