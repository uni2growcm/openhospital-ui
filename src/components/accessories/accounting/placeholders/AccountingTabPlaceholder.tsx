import {
	DashboardOutlined,
	PaymentOutlined,
	ReceiptLongOutlined,
} from '@mui/icons-material';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { IAccountingTabPlaceholderProps } from '../types';
import classes from './AccountingTabPlaceholder.module.scss';

export const AccountingTabPlaceholder: FC<IAccountingTabPlaceholderProps> = ({
	tab,
}) => {
	const { t } = useTranslation();

	const renderIcon = () => {
		switch (tab) {
			case 'overview':
				return <DashboardOutlined />;
			case 'bills':
				return <ReceiptLongOutlined />;
			case 'payments':
				return <PaymentOutlined />;
		}
	};

	return (
		<div className={classes.placeholderContainer}>
			<div className={classes.iconWrapper}>{renderIcon()}</div>
			<div className={classes.placeholderTitle}>
				{t(`accounting.tabs.${tab}`)}
			</div>
			<div className={classes.placeholderDescription}>
				{t('accounting.placeholder.comingSoon')}
			</div>
		</div>
	);
};
