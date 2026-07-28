import type { TextFieldProps } from '@mui/material';
import type { FIELD_VALIDATION } from '../../../types';

export interface IEthiopianDateFieldProps {
	fieldName: string;
	fieldValue: string;
	disableFuture?: boolean;
	disabled?: boolean;
	theme?: 'light' | 'regular';
	isValid?: boolean;
	errorText: string;
	label: string;
	format?: string;
	onChange?: (value: string) => void;
	required?: FIELD_VALIDATION;
	TextFieldComponent?: React.ComponentType<TextFieldProps>;
	setFieldValue?: (field: string, value: unknown) => void;
}

export interface EthiopianDatePickerProps {
	year: number;
	month: number;
	day: number;
	onChange: (year: number, month: number, day: number) => void;
	disableFuture?: boolean;
	disabled?: boolean;
	disableMonthChange?: boolean;
}
