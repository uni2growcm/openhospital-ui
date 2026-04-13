import { Button } from '@mui/material';
import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import PatientDetailsActivityContent from '~/components/activities/patientDetailsActivityContent/PatientDetailsActivityContent';
import { downloadBlob } from '~/libraries/downloadUtils/downloadUtils';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { getPatientAnalysis, printPatientAnalysis } from '~/state/analysis';
import { getPatient } from '~/state/patients/thunk';
import type { IState } from '~/types';
import type {
	PatientHistoricResponse,
	ReportGroupedRequest,
} from '../../../../generated';
import AnalysisTable from './analysisTable/AnalysisTable';
import './styles.scss';

export const Analysis: FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const data = useAppSelector(
		(state) => state.analysis.getPatientAnalysis.data ?? [],
	);

	const patient = useAppSelector(
		(state: IState) => state.patients.selectedPatient.data,
	);

	useEffect(() => {
		if (id) {
			dispatch(getPatient(id ?? ''));
		}
	}, [id, dispatch]);

	useEffect(() => {
		if (patient?.labBookId) {
			dispatch(getPatientAnalysis({ id: patient.labBookId }));
		}
	}, [dispatch, patient]);

	const handlePrint = (row: any) => {
		const analysisId = typeof row === 'number' ? row : row.id_rec;
		if (!analysisId) return;

		const reportGroupedRequest: ReportGroupedRequest = {
			l_id_rec_vld: [analysisId],
			filename: `patient-analysis-${analysisId}-${Date.now()}.pdf`,
		} as ReportGroupedRequest;
		dispatch(printPatientAnalysis(reportGroupedRequest))
			.unwrap()
			.then((blob) => {
				downloadBlob(
					blob,
					`patient-analysis-${id}-${analysisId}-${Date.now()}.pdf`,
				);
			})
			.catch((error) => {
				console.error('Print failed:', error);
			});
	};

	const handlePrintAllAnalysis = (data: PatientHistoricResponse) => {
		if (data) {
			const analysisIdlist = data.analyzes?.map((analyze) => analyze.id_rec);
			const reportGroupedRequest: ReportGroupedRequest = {
				l_id_rec_vld: analysisIdlist,
				filename: `patient-analysis-${id}-${Date.now()}.pdf`,
			} as ReportGroupedRequest;
			dispatch(printPatientAnalysis(reportGroupedRequest))
				.unwrap()
				.then((blob) => {
					downloadBlob(blob, `patient-analysis-${id}-${Date.now()}.pdf`);
				})
				.catch((error) => {
					console.error('Print failed:', error);
				});
		}
	};

	return (
		<PatientDetailsActivityContent title={t('patient.analysis')}>
			<div className="patientAnalysis">
				<div className="submit_button">
					<Button
						type="submit"
						variant="contained"
						onClick={() =>
							handlePrintAllAnalysis(data as PatientHistoricResponse)
						}
					>
						{t('analysis.print')}
					</Button>
				</div>
				<AnalysisTable handlePrint={handlePrint} />
			</div>
		</PatientDetailsActivityContent>
	);
};

export default Analysis;
