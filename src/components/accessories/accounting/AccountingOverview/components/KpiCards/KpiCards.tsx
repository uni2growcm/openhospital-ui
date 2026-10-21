import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { IKpiSummary } from '~/components/accessories/accounting/types';
import {
	formatCompactAmount,
	formatNumberWithSpaces,
	getPeriodLabel,
} from '../../utils/overviewMining';
import classes from './KpiCards.module.scss';

interface IKpiCardsProps {
	data: IKpiSummary;
	selectedYear: string;
	currency?: string;
}

export const KpiCards: FC<IKpiCardsProps> = ({
	data,
	selectedYear,
	currency = 'UGX',
}) => {
	const { t, i18n } = useTranslation();
	const parsedYear =
		Number.parseInt(selectedYear, 10) || new Date().getFullYear();
	const period = getPeriodLabel(parsedYear, i18n.language);

	return (
		<div data-cy="overview-kpi-grid" className={classes.kpiGrid}>
			<div data-cy="kpi-card-cashed-in" className={classes.kpiCard}>
				<div className={classes.kpiLabel}>
					{t('accounting.overview.kpi.cashedIn')}
				</div>
				<div className={classes.kpiValue}>
					{formatCompactAmount(data.cashedIn)}
				</div>
				<div className={classes.kpiSubtitle}>
					{t('accounting.overview.kpi.cashedInSubtitle', {
						currency,
						period,
						year: selectedYear,
					})}
				</div>
			</div>

			<div data-cy="kpi-card-outstanding-debt" className={classes.kpiCard}>
				<div className={classes.kpiLabel}>
					{t('accounting.overview.kpi.outstandingDebt')}
				</div>
				<div className={classes.kpiValue}>
					{formatCompactAmount(data.outstandingDebt)}
				</div>
				<div className={classes.kpiSubtitle}>
					{t('accounting.overview.kpi.outstandingDebtSubtitle', {
						currency,
						count: data.pendingBillsCount,
					})}
				</div>
			</div>

			<div data-cy="kpi-card-bills-issued" className={classes.kpiCard}>
				<div className={classes.kpiLabel}>
					{t('accounting.overview.kpi.billsIssued')}
				</div>
				<div className={classes.kpiValue}>
					{formatNumberWithSpaces(data.billsIssued)}
				</div>
				<div className={classes.kpiSubtitle}>
					{t('accounting.overview.kpi.billsIssuedSubtitle', {
						count: data.closedBillsCount,
					})}
				</div>
			</div>

			<div data-cy="kpi-card-refunded" className={classes.kpiCard}>
				<div className={classes.kpiLabel}>
					{t('accounting.overview.kpi.refunded')}
				</div>
				<div className={classes.kpiValue}>
					{formatCompactAmount(data.refunded)}
				</div>
				<div className={classes.kpiSubtitle}>
					{t('accounting.overview.kpi.refundedSubtitle', {
						currency,
						count: data.refundsCount,
					})}
				</div>
			</div>
		</div>
	);
};
