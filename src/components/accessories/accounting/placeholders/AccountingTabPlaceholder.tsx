import {
	DashboardOutlined,
	PaymentOutlined,
	ReceiptLongOutlined,
} from '@mui/icons-material';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountingTab, type IAccountingTabPlaceholderProps } from '../types';
import classes from './AccountingTabPlaceholder.module.scss';

export const AccountingTabPlaceholder: FC<IAccountingTabPlaceholderProps> = ({
	tab,
}) => {
	const { t } = useTranslation();

	const renderIcon = () => {
		switch (tab) {
			case AccountingTab.OVERVIEW:
				return <DashboardOutlined />;
			case AccountingTab.BILLS:
				return <ReceiptLongOutlined />;
			case AccountingTab.PAYMENTS:
				return <PaymentOutlined />;
		}
	};

	return (
		<div
			data-cy="accounting-tab-placeholder"
			className={classes.placeholderContainer}
		>
			<div className={classes.iconWrapper}>{renderIcon()}</div>
			<div data-cy="placeholder-title" className={classes.placeholderTitle}>
				{t(`accounting.tabs.${tab}`)}
			</div>
			<div
				data-cy="placeholder-description"
				className={classes.placeholderDescription}
			>
				{t('accounting.placeholder.comingSoon')}
			</div>
		</div>
	);
};
