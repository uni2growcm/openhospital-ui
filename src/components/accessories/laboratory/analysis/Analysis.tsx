import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import PatientDetailsActivityContent from '~/components/activities/patientDetailsActivityContent/PatientDetailsActivityContent';
import { useAppSelector } from '~/libraries/hooks/redux';
import { PatientDTOStatusEnum } from '../../../../generated';
import type { IState } from '../../../../types';
import InfoBox from '../../infoBox/InfoBox';
import AnalysisTable from './analysisTable/AnalysisTable';
import './styles.scss';

export const Analysis: FC = () => {
	const { t } = useTranslation();
	const patient = useAppSelector(
		(state: IState) => state.patients.selectedPatient.data,
	);

	return (
		<PatientDetailsActivityContent title={t('patient.analysis')}>
			<div className="patientAnalysis">
				{patient?.status === PatientDTOStatusEnum.I && (
					<InfoBox
						type="info"
						message={t('admission.patientalreadyadmitted')}
					/>
				)}

				<AnalysisTable handlePrint={() => {}} />
			</div>
		</PatientDetailsActivityContent>
	);
};

export default Analysis;
