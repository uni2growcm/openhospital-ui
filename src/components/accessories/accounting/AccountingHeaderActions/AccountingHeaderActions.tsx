import {
	Add,
	ArchiveOutlined,
	DescriptionOutlined,
	FileDownloadOutlined,
	KeyboardArrowDown,
	PictureAsPdfOutlined,
} from '@mui/icons-material';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import DateField from '../../dateField/DateField';
import type { IAccountingHeaderActionsProps } from '../types';
import classes from './AccountingHeaderActions.module.scss';

export const AccountingHeaderActions: FC<IAccountingHeaderActionsProps> = ({
	activeTab,
	selectedYear,
	onYearChange,
	onNewBill,
	onReports,
	onArchiveClosed,
	onExportSage,
	onExportPdf,
	onExportCsv,
	onPaymentsByUserReport,
}) => {
	const { t } = useTranslation();

	if (activeTab === 'overview') {
		const yearDateIso = selectedYear
			? new Date(
					Number.parseInt(selectedYear, 10) || new Date().getFullYear(),
					0,
					1,
				).toISOString()
			: new Date().toISOString();

		return (
			<div className={classes.actionsContainer}>
				<div className={classes.yearFieldWrapper}>
					<DateField
						fieldName="year"
						views={['year']}
						fieldValue={yearDateIso}
						disableFuture={true}
						theme="regular"
						format="yyyy"
						isValid={true}
						errorText=""
						label={t('accounting.actions.year')}
						onChange={(value: any) => {
							if (value) {
								const d = new Date(value);
								if (!Number.isNaN(d.getTime())) {
									onYearChange(d.getFullYear().toString());
								}
							}
						}}
					/>
				</div>
				<button
					type="button"
					className={classes.primaryButton}
					onClick={onNewBill}
				>
					<Add />
					<span>{t('accounting.actions.newBill')}</span>
				</button>
			</div>
		);
	}

	if (activeTab === 'bills') {
		return (
			<div className={classes.actionsContainer}>
				<button
					type="button"
					className={classes.outlineButton}
					onClick={onReports}
				>
					<DescriptionOutlined />
					<span>{t('accounting.actions.reports')}</span>
					<KeyboardArrowDown />
				</button>

				<button
					type="button"
					className={classes.outlineButton}
					onClick={onArchiveClosed}
				>
					<ArchiveOutlined />
					<span>{t('accounting.actions.archiveClosed')}</span>
				</button>

				<button
					type="button"
					className={classes.outlineButton}
					onClick={onExportSage}
				>
					<FileDownloadOutlined />
					<span>{t('accounting.actions.exportSage')}</span>
				</button>

				<button
					type="button"
					className={classes.outlineButton}
					onClick={onExportPdf}
				>
					<PictureAsPdfOutlined />
					<span>{t('accounting.actions.exportPdf')}</span>
				</button>

				<button
					type="button"
					className={classes.primaryButton}
					onClick={onNewBill}
				>
					<Add />
					<span>{t('accounting.actions.newBill')}</span>
				</button>
			</div>
		);
	}

	if (activeTab === 'payments') {
		return (
			<div className={classes.actionsContainer}>
				<button
					type="button"
					className={classes.outlineButton}
					onClick={onExportCsv}
				>
					<FileDownloadOutlined />
					<span>{t('accounting.actions.exportCsv')}</span>
				</button>

				<button
					type="button"
					className={classes.outlineButton}
					onClick={onPaymentsByUserReport}
				>
					<DescriptionOutlined />
					<span>{t('accounting.actions.paymentsByUserReport')}</span>
				</button>
			</div>
		);
	}

	return null;
};
