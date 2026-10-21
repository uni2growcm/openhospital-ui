import { CircularProgress } from '@mui/material';
import { type FC, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { getBillsByYear } from '../../../../state/bills';
import { getHospital } from '../../../../state/hospital';
import type { IAccountingOverviewProps } from '../types';
import classes from './AccountingOverview.module.scss';
import { IndebtedPatientsWidget } from './components/IndebtedPatientsWidget/IndebtedPatientsWidget';
import { KpiCards } from './components/KpiCards/KpiCards';
import { PaymentsDebtsChart } from './components/PaymentsDebtsChart/PaymentsDebtsChart';
import { ReportsPanel } from './components/ReportsPanel/ReportsPanel';
import { TopItemsWidget } from './components/TopItemsWidget/TopItemsWidget';
import {
	computeIndebtedPatients,
	computeKpiSummary,
	computeMonthlyPaymentsDebts,
	computeTopItems,
} from './utils/overviewMining';

export const AccountingOverview: FC<IAccountingOverviewProps> = ({
	selectedYear,
}) => {
	const dispatch = useAppDispatch();
	const parsedYear = useMemo(() => {
		const parsed = Number.parseInt(selectedYear, 10);
		return Number.isNaN(parsed) ? new Date().getFullYear() : parsed;
	}, [selectedYear]);

	const hospital = useAppSelector((state) => state.hospital.getHospital.data);
	const currency = hospital?.currencyCod || 'UGX';

	const { data: bills = [], status } = useAppSelector((state) => {
		return {
			data: state.bills.getBillsByYear.data ?? [],
			status: state.bills.getBillsByYear.status,
		};
	});

	useEffect(() => {
		if (!hospital) {
			dispatch(getHospital());
		}
	}, [dispatch, hospital]);

	useEffect(() => {
		dispatch(getBillsByYear(parsedYear));
	}, [dispatch, parsedYear]);

	const kpiSummary = useMemo(
		() => computeKpiSummary(bills, parsedYear),
		[bills, parsedYear],
	);

	const monthlyPaymentsDebts = useMemo(
		() => computeMonthlyPaymentsDebts(bills, parsedYear),
		[bills, parsedYear],
	);

	const topItems = useMemo(
		() => computeTopItems(bills, parsedYear),
		[bills, parsedYear],
	);

	const indebtedPatients = useMemo(
		() => computeIndebtedPatients(bills, parsedYear),
		[bills, parsedYear],
	);

	const isLoading = status === 'LOADING' && bills.length === 0;

	return (
		<div data-cy="accounting-overview" className={classes.overviewContainer}>
			{isLoading ? (
				<div className={classes.loadingOverlay}>
					<CircularProgress />
				</div>
			) : (
				<div className={classes.overviewLayout}>
					<div className={classes.mainColumn}>
						<KpiCards
							data={kpiSummary}
							selectedYear={selectedYear}
							currency={currency}
						/>

						<PaymentsDebtsChart data={monthlyPaymentsDebts} />

						<div className={classes.bottomWidgetsRow}>
							<TopItemsWidget items={topItems} />
							<IndebtedPatientsWidget patients={indebtedPatients} />
						</div>
					</div>

					<div className={classes.sideColumn}>
						<ReportsPanel />
					</div>
				</div>
			)}
		</div>
	);
};

export default AccountingOverview;
