import { CircularProgress } from '@mui/material';
import { type FunctionComponent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import InfoBox from '~/components/accessories/infoBox/InfoBox';
import Table from '~/components/accessories/table/Table';
import type { LabbookPatientHistoricDTO } from '~/generated';
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

	const header = ['id', 'prescriptionDate', 'analysis'];
	const dateFields = ['prescriptionDate'];

	const label = {
		id: t('analysis.id'),
		recordType: t('analysis.recordType'),
		prescriptionDate: t('analysis.prescriptionDate'),
		analysis: t('analysis.analysis'),
		recordNumber: t('analysis.recordNumber'),
		variable: t('analysis.variable'),
		result: t('analysis.result'),
	};
	const order = ['id', 'prescriptionDate', 'analysis'];

	const patient = useAppSelector(
		(state: IState) => state.patients.selectedPatient.data,
	);

	const data = useAppSelector(
		(state) =>
			(state.analysis.getPatientAnalysis.data ??
				{}) as LabbookPatientHistoricDTO,
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

	const analysisStatus = useAppSelector(
		(state) => state.analysis.getPatientAnalysis.status,
	);

	const formatDataToDisplay = useMemo(() => {
		return (data.analyzes ?? []).map((item) => {
			return {
				id: item.id ?? 0,
				recordType: item.recordType ?? '',
				prescriptionDate: item.prescriptionDate
					? renderDateTime(item.prescriptionDate)
					: '',
				analysis: item.analysis ?? '',
				recordNumber: item.recordNumber ?? '',
				variables: item.variables ?? [],
			};
		});
	}, [data]);

	const errorMessage = useAppSelector(
		(state) =>
			state.analysis.getPatientAnalysis.error?.message ||
			t('common.somethingwrong'),
	) as string;

	const customRenderDetails = (row: Record<string, any>) => (
		<ul>
			{(['recordType', 'recordNumber'] as const).map((key) => (
				<li className="collapseItem_row" key={key}>
					<strong>{label[key]}: </strong>
					<span>{row[key]}</span>
				</li>
			))}

			{row.variables?.length > 0 && (
				<li className="collapseItem_row">
					<strong>
						{t('analysis.variable')} / {t('analysis.result')}:
					</strong>
					<ul>
						{row.variables.map((v: any, i: number) => (
							<li key={i}>
								{v.variable}: {v.result}
							</li>
						))}
					</ul>
				</li>
			)}
		</ul>
	);

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
								customRenderDetails={customRenderDetails}
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
