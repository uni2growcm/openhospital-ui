import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { IIndebtedPatient } from '~/components/accessories/accounting/types';
import { formatNumberWithSpaces } from '../../utils/overviewMining';
import classes from './IndebtedPatientsWidget.module.scss';

interface IIndebtedPatientsWidgetProps {
	patients: IIndebtedPatient[];
}

export const IndebtedPatientsWidget: FC<IIndebtedPatientsWidgetProps> = ({
	patients,
}) => {
	const { t } = useTranslation();

	return (
		<div
			data-cy="overview-indebted-patients-card"
			className={classes.widgetCard}
		>
			<h2 className={classes.widgetTitle}>
				{t('accounting.overview.indebtedPatients.title')}
			</h2>

			{patients.length === 0 ? (
				<div className={classes.emptyState}>
					{t('accounting.overview.indebtedPatients.empty')}
				</div>
			) : (
				<div className={classes.patientsList}>
					{patients.map((patient) => (
						<div
							key={patient.id}
							data-cy={`indebted-patient-${patient.id}`}
							className={classes.patientRow}
						>
							<div className={classes.patientInfo}>
								<span className={classes.patientName} title={patient.name}>
									{patient.name}
								</span>
								<span className={classes.billCount}>
									{t('accounting.overview.indebtedPatients.billsCount', {
										count: patient.billsCount,
									})}
								</span>
							</div>
							<div className={classes.patientDebt}>
								{formatNumberWithSpaces(patient.debt)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
