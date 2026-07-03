import { Button } from '@mui/material';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import PatientDetailsActivityContent from '~/components/activities/patientDetailsActivityContent/PatientDetailsActivityContent';
import { downloadBlob } from '~/libraries/downloadUtils/downloadUtils';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { getPatientAnalysis, printPatientAnalysis } from '~/state/analysis';
import { getPatient } from '~/state/patients/thunk';
import type { IState } from '~/types';
import type {
	LabbookPatientHistoricDTO,
	ReportGroupedRequest,
} from '../../../../generated';
import './styles.scss';
import InfoBox from '../../infoBox/InfoBox';
import AnalysisTable from './table/AnalysisTable';

export const Analysis: FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const [isPrintError, setIsPrintError] = useState<boolean>(false);
	const infoBoxRef = useRef<HTMLDivElement>(null);
	const data = useAppSelector(
		(state) => state.analysis.getPatientAnalysis.data ?? [],
	);

	const patient = useAppSelector(
		(state: IState) => state.patients.selectedPatient.data,
	);

	useEffect(() => {
		if (id) {
			dispatch(getPatient(id));
		}
	}, [id, dispatch]);

	useEffect(() => {
		if (patient?.labBookId) {
			dispatch(getPatientAnalysis({ id: patient.labBookId }));
		}
	}, [dispatch, patient]);

	const handlePrint = useCallback(
		(row: any) => {
			setIsPrintError(false);
			const analysisId = typeof row === 'number' ? row : row.id;
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
				.catch(() => {
					setIsPrintError(true);
				});
		},
		[id, dispatch],
	);

	const handlePrintAllAnalysis = useCallback(
		(data: LabbookPatientHistoricDTO) => {
			setIsPrintError(false);
			if (data) {
				const analysisIdlist = [
					...new Set(data.analyzes?.map((analyze) => analyze.id)),
				];
				
				const reportGroupedRequest: ReportGroupedRequest = {
					l_id_rec_vld: analysisIdlist,
					filename: `patient-analysis-${id}-${Date.now()}.pdf`,
				} as ReportGroupedRequest;

				dispatch(printPatientAnalysis(reportGroupedRequest))
					.unwrap()
					.then((blob) => {
						downloadBlob(blob, `patient-analysis-${id}-${Date.now()}.pdf`);
					})
					.catch(() => {
						setIsPrintError(true);
					});
			}
		},
		[id, dispatch],
	);

	return (
		<PatientDetailsActivityContent title={t('patient.analysis')}>
			<div className="patientAnalysis">
				<div className="submit_button">
					<Button
						type="submit"
						variant="contained"
						onClick={() =>
							handlePrintAllAnalysis(data as LabbookPatientHistoricDTO)
						}
					>
						{t('analysis.print')}
					</Button>
				</div>
				<AnalysisTable handlePrint={handlePrint} />
				{isPrintError && (
					<div ref={infoBoxRef} className="info-box-container">
						<InfoBox type="error" message={t('analysis.printnotavailable')} />
					</div>
				)}
			</div>
		</PatientDetailsActivityContent>
	);
};

export default Analysis;
