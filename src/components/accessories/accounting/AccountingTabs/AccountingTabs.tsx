import classNames from 'classnames';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { AccountingTab, IAccountingTabsProps } from '../types';
import classes from './AccountingTabs.module.scss';

const TABS: { id: AccountingTab; labelKey: string }[] = [
	{ id: 'overview', labelKey: 'accounting.tabs.overview' },
	{ id: 'bills', labelKey: 'accounting.tabs.bills' },
	{ id: 'payments', labelKey: 'accounting.tabs.payments' },
];

export const AccountingTabs: FC<IAccountingTabsProps> = ({
	activeTab,
	onTabChange,
}) => {
	const { t } = useTranslation();

	return (
		<div className={classes.tabsContainer} role="tablist">
			{TABS.map((tab) => (
				<button
					key={tab.id}
					type="button"
					role="tab"
					aria-selected={activeTab === tab.id}
					className={classNames(classes.tabItem, {
						[classes.active]: activeTab === tab.id,
					})}
					onClick={() => onTabChange(tab.id)}
				>
					{t(tab.labelKey)}
				</button>
			))}
		</div>
	);
};
