import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientDetailsActivityContent } from '~/components/activities/patientDetailsActivityContent/PatientDetailsActivityContent';
import { useAppDispatch } from '~/libraries/hooks/redux';
import { getMedicals } from '../../../state/medicals';
import { PatientExtraData } from '../patientExtraData/patientExtraData';
import Tabs from '../tabs/Tabs';
import type { TTabConfig } from '../tabs/types';
import PatientSummaryByDate from './patientSummaryByDate/PatientSummaryByDate';
import PatientSummaryByType from './patientSummaryByType/PatientSummaryByType';
import './styles.scss';
import { Print } from '@mui/icons-material';
import { Button } from '@mui/material';
import { printSubject } from '~/libraries/printUtils/printUtils';

export const PatientSummary = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	useEffect(() => {
		dispatch(getMedicals());
	}, [dispatch]);

	const patientSummaryTabs: TTabConfig = [
		{ label: t('common.orderbydate'), content: <PatientSummaryByDate /> },
		{ label: t('common.orderbytype'), content: <PatientSummaryByType /> },
	];

	const handlePrint = () => {
		printSubject.next(null);
		setTimeout(() => {
			window.print();
		}, 1000);
	};

	return (
		<PatientDetailsActivityContent title={t('patient.summary')}>
			<div className="patientSummary">
				<Button
					className="printButton"
					startIcon={<Print />}
					type="button"
					onClick={handlePrint}
					variant="contained"
				>
					{t('common.printData')}
				</Button>
				<PatientExtraData readOnly={true} />
				<Tabs config={patientSummaryTabs} />
			</div>
		</PatientDetailsActivityContent>
	);
};
