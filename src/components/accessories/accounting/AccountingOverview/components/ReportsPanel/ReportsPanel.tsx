import { ChevronRight } from '@mui/icons-material';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { IReportItem } from '~/components/accessories/accounting/types';
import classes from './ReportsPanel.module.scss';

const REPORTS: IReportItem[] = [
	{
		key: 'patientStatement',
		labelKey: 'accounting.overview.reports.patientStatement',
	},
	{ key: 'todayClosure', labelKey: 'accounting.overview.reports.todayClosure' },
	{ key: 'badDebtsOnly', labelKey: 'accounting.overview.reports.badDebtsOnly' },
	{ key: 'allBills', labelKey: 'accounting.overview.reports.allBills' },
	{
		key: 'paymentsByUser',
		labelKey: 'accounting.overview.reports.paymentsByUser',
	},
	{
		key: 'paymentsAndRefundsByUser',
		labelKey: 'accounting.overview.reports.paymentsAndRefundsByUser',
	},
	{
		key: 'incomesByItemCategory',
		labelKey: 'accounting.overview.reports.incomesByItemCategory',
	},
	{ key: 'refunds', labelKey: 'accounting.overview.reports.refunds' },
	{
		key: 'debtsByItemCategory',
		labelKey: 'accounting.overview.reports.debtsByItemCategory',
	},
	{
		key: 'billsByReductionPlan',
		labelKey: 'accounting.overview.reports.billsByReductionPlan',
	},
	{
		key: 'globalConsumptionByService',
		labelKey: 'accounting.overview.reports.globalConsumptionByService',
	},
];

interface IReportsPanelProps {
	onSelectReport?: (reportKey: string) => void;
}

export const ReportsPanel: FC<IReportsPanelProps> = ({ onSelectReport }) => {
	const { t } = useTranslation();
	const [activeNotification, setActiveNotification] = useState<string | null>(
		null,
	);

	const handleReportClick = (report: IReportItem) => {
		if (onSelectReport) {
			onSelectReport(report.key);
		} else {
			setActiveNotification(t(report.labelKey));
			setTimeout(() => {
				setActiveNotification(null);
			}, 3000);
		}
	};

	return (
		<div data-cy="overview-reports-card" className={classes.reportsCard}>
			<h2 className={classes.reportsTitle}>
				{t('accounting.overview.reports.title')}
			</h2>
			<p className={classes.reportsSubtitle}>
				{t('accounting.overview.reports.subtitle')}
			</p>

			<div className={classes.reportsList}>
				{REPORTS.map((report) => (
					<button
						key={report.key}
						type="button"
						data-cy={`report-item-${report.key}`}
						className={classes.reportItem}
						onClick={() => handleReportClick(report)}
					>
						<span className={classes.reportLabel}>{t(report.labelKey)}</span>
						<ChevronRight className={classes.reportChevron} />
					</button>
				))}
			</div>

			{activeNotification && (
				<div
					data-cy="report-feedback-banner"
					className={classes.feedbackBanner}
				>
					<span>
						{t('accounting.overview.reports.exportSelected', {
							report: activeNotification,
						})}
					</span>
				</div>
			)}
		</div>
	);
};
