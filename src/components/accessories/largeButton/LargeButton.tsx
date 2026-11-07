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
	'data-cy': dataCy = 'large-button',
	...props
}) => {
	return (
		<Button
			data-cy={dataCy}
			className={`largeButton ${className}`}
			variant={variant}
			onClick={handleClick ?? onClick}
			{...props}
		>
			{children}
		</Button>
	);
};

export default LargeButton;
