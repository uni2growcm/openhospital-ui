import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	IconButton,
	InputAdornment,
	TextField as MuiTextField,
} from '@mui/material';
import type { FieldInputProps } from 'formik';
import {
	type FocusEvent,
	type FunctionComponent,
	type MouseEvent,
	useState,
} from 'react';

interface IProps {
	field: FieldInputProps<string>;
	label: string;
	isValid?: boolean;
	errorText?: string;
	onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	disabled?: boolean;
}

const PasswordField: FunctionComponent<IProps> = ({
	field,
	label,
	isValid,
	errorText,
	onBlur,
	disabled,
}) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const handleMouseDown = (event: MouseEvent) => {
		event.preventDefault();
	};

	return (
		<MuiTextField
			id={field.name}
			name={field.name}
			label={label}
			type={isPasswordVisible ? 'text' : 'password'}
			value={field.value}
			onChange={field.onChange}
			onBlur={onBlur}
			error={isValid}
			helperText={errorText}
			variant="outlined"
			size="small"
			margin="dense"
			fullWidth
			disabled={disabled}
			InputProps={{
				autoComplete: 'one-time-code',
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
							onClick={() => setIsPasswordVisible((visible) => !visible)}
							onMouseDown={handleMouseDown}
							edge="end"
							size="small"
						>
							{isPasswordVisible ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	);
};

export default PasswordField;
