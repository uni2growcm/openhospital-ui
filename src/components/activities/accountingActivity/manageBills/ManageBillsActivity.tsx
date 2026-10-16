import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '../../../../consts';
import { useAppSelector } from '../../../../libraries/hooks/redux';
import { AccountingHeaderActions } from '../../../accessories/accounting/AccountingHeaderActions/AccountingHeaderActions';
import { AccountingTabs } from '../../../accessories/accounting/AccountingTabs/AccountingTabs';
import { AccountingTabPlaceholder } from '../../../accessories/accounting/placeholders/AccountingTabPlaceholder';
import { AccountingTab } from '../../../accessories/accounting/types';
import AppHeader from '../../../accessories/appHeader/AppHeader';
import Footer from '../../../accessories/footer/Footer';
import classes from './ManageBillsActivity.module.scss';

export const ManageBillsActivity: FC = () => {
	const { t } = useTranslation();
	const [currentTab, setCurrentTab] = useState<AccountingTab>(
		AccountingTab.OVERVIEW,
	);
	const [selectedYear, setSelectedYear] = useState<string>(() =>
		new Date().getFullYear().toString(),
	);

	const userCredentials = useAppSelector(
		(state) => state.main.authentication?.data,
	);

	const breadcrumbMap = useMemo(() => {
		return {
			[t('nav.accounting')]: PATHS.accounting,
			[t(`accounting.tabs.${currentTab}`)]: '',
		};
	}, [t, currentTab]);

	const getSubtitle = () => {
		switch (currentTab) {
			case AccountingTab.OVERVIEW:
				return t('accounting.subtitles.overview', { year: selectedYear });
			case AccountingTab.BILLS:
				return t('accounting.subtitles.bills');
			case AccountingTab.PAYMENTS:
				return t('accounting.subtitles.payments');
		}
	};

	return (
		<div data-cy="manage-bills-activity" className={classes.manageBills}>
			<AppHeader
				userCredentials={userCredentials ?? {}}
				breadcrumbMap={breadcrumbMap}
			/>
			<div className={classes.background}>
				<div className={classes.content}>
					<div className={classes.contentInner}>
						<div className={classes.headerRow}>
							<div className={classes.titleSection}>
								<h1 data-cy="activity-title" className={classes.title}>
									{t('accounting.title')}
								</h1>
								<div data-cy="activity-subtitle" className={classes.subtitle}>
									{getSubtitle()}
								</div>
							</div>
							<div className={classes.actionsSection}>
								<AccountingHeaderActions
									activeTab={currentTab}
									selectedYear={selectedYear}
									onYearChange={setSelectedYear}
								/>
							</div>
						</div>

						<AccountingTabs
							activeTab={currentTab}
							onTabChange={setCurrentTab}
						/>

						<div className={classes.tabContent}>
							<AccountingTabPlaceholder tab={currentTab} />
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default ManageBillsActivity;
