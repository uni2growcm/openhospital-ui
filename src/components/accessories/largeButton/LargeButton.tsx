import { Button } from '@mui/material';
import type { FunctionComponent } from 'react';
import './styles.scss';
import type { IProps } from './types';

const LargeButton: FunctionComponent<IProps> = ({
	children,
	handleClick,
	onClick,
	variant = 'contained',
	className = '',
	...props
}) => {
	return (
		<Button
			{...props}
			data-slot="large-button"
			className={`largeButton ${className}`}
			variant={variant}
			onClick={handleClick ?? onClick}
		>
			{children}
		</Button>
	);
};

export default LargeButton;
