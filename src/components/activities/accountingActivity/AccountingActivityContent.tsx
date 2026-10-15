import type { ComponentProps } from 'react';
import './styles.scss';

type AccountingActivityContentProps = { title: string } & Omit<
	ComponentProps<'div'>,
	'title'
>;

export function AccountingActivityContent({
	children,
	title,
	...props
}: AccountingActivityContentProps) {
	return (
		<div {...props} className="accountingActivity__content">
			<div className="accountingActivity__content_title">{title}</div>
			{children}
		</div>
	);
}
