import { CircularProgress } from '@mui/material';
import { type FunctionComponent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import InfoBox from '~/components/accessories/infoBox/InfoBox';
import Table from '~/components/accessories/table/Table';
import type { PatientHistoricResponse } from '~/generated/models/PatientHistoricResponse';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { getPatientAnalysis } from '~/state/analysis';
import { getPatient } from '~/state/patients';
import type { IState } from '~/types';
import { renderDateTime } from '../../../../../libraries/formatUtils/dataFormatting';

interface IOwnProps {
	handlePrint: (row: any) => void;
}

const AnalysisTable: FunctionComponent<IOwnProps> = ({ handlePrint }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { id } = useParams();

	const header = ['id_rec', 'date_prescr'];
	const dateFields = ['date_prescr'];

	const label = {
		id_rec: t('analysis.id_rec'),
		type_rec: t('analysis.type_rec'),
		date_prescr: t('analysis.date_prescr'),
		analysis: t('analysis.analysis'),
		rec_num: t('analysis.rec_num'),
		variable: t('analysis.variable'),
		result: t('analysis.result'),
	};
	const order = ['id_rec', 'date_prescr'];

	const patient = useAppSelector(
		(state: IState) => state.patients.selectedPatient.data,
	);

	const data = useAppSelector(
		(state) =>
			(state.analysis.getPatientAnalysis.data ?? {}) as PatientHistoricResponse,
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

	const formatDataToDisplay = useMemo(() => {
		return (data.analyzes ?? []).map((item) => {
			return {
				id_rec: item.id_rec ?? 0,
				type_rec: item.type_rec ?? '',
				date_prescr: item.date_prescr ? renderDateTime(item.date_prescr) : '',
				analysis: item.analysis ?? '',
				rec_num: item.rec_num ?? '',
				variable: item.variable ?? '',
				result: item.result ?? '',
			};
		});
	}, [data]);

	const analysisStatus = useAppSelector(
		(state) => state.analysis.getPatientAnalysis.status,
	);

	const errorMessage = useAppSelector(
		(state) =>
			state.analysis.getPatientAnalysis.error?.message ||
			t('common.somethingwrong'),
	) as string;

	return (
		<div className="patientAnalysisTable">
			<h5>{t('analysis.previousentries')}</h5>
			{(() => {
				switch (analysisStatus) {
					case 'FAIL':
						return <InfoBox type="error" message={errorMessage} />;
					case 'LOADING':
						return (
							<CircularProgress
								style={{ marginLeft: '50%', position: 'relative' }}
							/>
						);
					case 'SUCCESS':
					case 'IDLE':
						return (
							<Table
								rowData={formatDataToDisplay}
								dateFields={dateFields}
								tableHeader={header}
								labelData={label}
								columnsOrder={order}
								rowsPerPage={5}
								isCollapsabile={true}
								onPrint={handlePrint}
								initialOrderBy="id_rec"
								showEmptyCell={false}
							/>
						);
					case 'SUCCESS_EMPTY':
						return <InfoBox type="info" message={t('common.emptydata')} />;
					default:
						return null;
				}
			})()}
		</div>
	);
};

export default AnalysisTable;
