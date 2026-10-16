import classNames from 'classnames';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountingTab, type IAccountingTabsProps } from '../types';
import classes from './AccountingTabs.module.scss';

const TABS: { id: AccountingTab; labelKey: string }[] = [
	{ id: AccountingTab.OVERVIEW, labelKey: 'accounting.tabs.overview' },
	{ id: AccountingTab.BILLS, labelKey: 'accounting.tabs.bills' },
	{ id: AccountingTab.PAYMENTS, labelKey: 'accounting.tabs.payments' },
];

export const AccountingTabs: FC<IAccountingTabsProps> = ({
	activeTab,
	onTabChange,
}) => {
	const { t } = useTranslation();

	return (
		<div
			data-cy="accounting-tabs"
			className={classes.tabsContainer}
			role="tablist"
		>
			{TABS.map((tab) => (
				<button
					key={tab.id}
					type="button"
					role="tab"
					data-cy={`accounting-tab-${tab.id}`}
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
