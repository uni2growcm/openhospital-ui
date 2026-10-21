import { CircularProgress } from '@mui/material';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import {
	getPaymentUsers,
	searchPayments,
	searchPaymentsPageable,
	selectPayments,
	selectPaymentsPageableData,
	selectPaymentsPageInfo,
	selectPaymentUsers,
	selectSearchPaymentsPageableState,
	selectSearchPaymentsState,
} from '../../../../state/bills';
import { selectHospital } from '../../../../state/hospital';
import { getDefaultFilterValues } from '../../../accessories/accounting/payments/consts';
import { PaymentsFilterBar } from '../../../accessories/accounting/payments/PaymentsFilterBar';
import { PaymentsListingTable } from '../../../accessories/accounting/payments/PaymentsListingTable';
import { PaymentsSummaryCards } from '../../../accessories/accounting/payments/PaymentsSummaryCards';
import type {
	TPaymentsFilterValues,
	TPaymentsViewMode,
} from '../../../accessories/accounting/payments/types';
import type { TFilterValues } from '../../../accessories/billTable/types';
import InfoBox from '../../../accessories/infoBox/InfoBox';
import classes from './PaymentsListing.module.scss';

export const PaymentsListing: FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [filterValues, setFilterValues] = useState<TPaymentsFilterValues>(
		getDefaultFilterValues,
	);
	const [viewMode, setViewMode] = useState<TPaymentsViewMode>('list');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Full date-range result (not paginated) — feeds the summary cards and the "By day" grouping.
	const payments = useAppSelector(selectPayments) ?? [];
	const status = useAppSelector(selectSearchPaymentsState).status;
	const errorMessage = useAppSelector(
		(state) =>
			state.bills.searchPayments.error?.message || t('common.somethingwrong'),
	) as string;

	// Server-paginated page of the same filtered range — feeds the "List" view rows.
	const pageRows = useAppSelector(selectPaymentsPageableData) ?? [];
	const pageInfo = useAppSelector(selectPaymentsPageInfo);
	const pageableLoading = useAppSelector(
		selectSearchPaymentsPageableState,
	).isLoading;

	const users = useAppSelector(selectPaymentUsers) ?? [];
	const hospital = useAppSelector(selectHospital);

	useEffect(() => {
		dispatch(getPaymentUsers());
	}, [dispatch]);

	useEffect(() => {
		dispatch(
			searchPayments({
				fromDate: filterValues.fromDate,
				toDate: filterValues.toDate,
				patientCode: filterValues.patientCode || undefined,
			} as TFilterValues),
		);
	}, [dispatch, filterValues]);

	useEffect(() => {
		dispatch(
			searchPaymentsPageable({
				fromDate: filterValues.fromDate,
				toDate: filterValues.toDate,
				patientCode: filterValues.patientCode || undefined,
				user: filterValues.user || undefined,
				page,
				size: rowsPerPage,
			} as TFilterValues & { user?: string; page: number; size: number }),
		);
	}, [dispatch, filterValues, page, rowsPerPage]);

	const handleFilterSubmit = (values: TPaymentsFilterValues) => {
		setPage(0);
		setFilterValues(values);
	};

	const handleRowsPerPageChange = (size: number) => {
		setPage(0);
		setRowsPerPage(size);
	};

	const isLoading = status === 'LOADING';

	return (
		<div data-cy="payments-listing" className={classes.paymentsListing}>
			<PaymentsFilterBar
				initialValues={filterValues}
				users={users}
				isLoading={isLoading}
				onSubmit={handleFilterSubmit}
			/>

			{(() => {
				switch (status) {
					case 'FAIL':
						return <InfoBox type="error" message={errorMessage} />;
					case 'LOADING':
						return (
							<CircularProgress
								data-cy="payments-listing-loading"
								style={{ margin: '40px auto', display: 'block' }}
							/>
						);
					default:
						return (
							<>
								<PaymentsSummaryCards
									payments={payments}
									currencyCode={hospital?.currencyCod}
								/>
								<PaymentsListingTable
									payments={payments}
									pageRows={pageRows}
									viewMode={viewMode}
									onViewModeChange={setViewMode}
									page={page}
									totalPages={pageInfo?.totalPages ?? 0}
									pageSize={rowsPerPage}
									totalElements={pageInfo?.totalNbOfElements ?? 0}
									isLoading={pageableLoading}
									onPageChange={setPage}
									onPageSizeChange={handleRowsPerPageChange}
								/>
							</>
						);
				}
			})()}
		</div>
	);
};

export default PaymentsListing;
