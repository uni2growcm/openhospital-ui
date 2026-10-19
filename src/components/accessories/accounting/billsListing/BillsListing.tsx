import { Replay } from '@mui/icons-material';
import {
	Chip,
	CircularProgress,
	Popover,
	TablePagination,
} from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers';
import classNames from 'classnames';
import { useFormik } from 'formik';
import numbro from 'numbro';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import type { BillDTO } from '~/generated';
import {
	renderDate,
	renderDateTime,
} from '~/libraries/formatUtils/dataFormatting';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import {
	selectBillsPage,
	selectBillsSummary,
	selectSearchBillsPageableError,
	selectSearchBillsPageableLoading,
} from '~/state/bills/selectors';
import { searchBillsPageable, searchBillsSummary } from '~/state/bills/thunk';
import { selectUserList } from '~/state/users/selectors';
import { getUsers } from '~/state/users/thunk';
import Button from '../../button/Button';
import DateField from '../../dateField/DateField';
import InfoBox from '../../infoBox/InfoBox';
import PatientPicker from '../../patientPicker/PatientPicker';
import SelectField from '../../selectField/SelectField';
import type { TFilterField } from '../../table/filter/types';
import Table from '../../table/Table';
import classes from './BillsListing.module.scss';
import type { TQuickRange, TStatusTab } from './types';

const startOfDay = (date: Date) => {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
};

const endOfDay = (date: Date) => {
	const d = new Date(date);
	d.setHours(23, 59, 59, 999);
	return d;
};

const isSameDay = (isoDate: string | undefined, reference: Date) => {
	if (!isoDate) {
		return false;
	}
	const d = new Date(isoDate);
	return (
		d.getFullYear() === reference.getFullYear() &&
		d.getMonth() === reference.getMonth() &&
		d.getDate() === reference.getDate()
	);
};

// The bills page tracks amounts in CFA francs, not the app's default "$" —
// local override of the shared currencyFormat, scoped to this page only.
const currencyFormat = (num: number | string | undefined) =>
	numbro(num ?? 0)
		.formatCurrency({
			currencySymbol: ' FCFA',
			mantissa: 0,
			currencyPosition: 'postfix',
			thousandSeparated: true,
		})
		.replace(/,/g, ' ')
		.trim();

// Splits "65 500 FCFA" into the number and the unit so the summary cards can
// render the unit smaller than the amount, matching the mockup.
const splitCurrency = (num: number | string | undefined) => {
	const formatted = currencyFormat(num);
	const separatorIndex = formatted.lastIndexOf(' ');
	return {
		value: formatted.slice(0, separatorIndex),
		unit: formatted.slice(separatorIndex + 1),
	};
};

const CardAmount: FC<{ num: number | string | undefined }> = ({ num }) => {
	const { value, unit } = splitCurrency(num);
	return (
		<>
			{value}
			<span className={classes.currencyUnit}> {unit}</span>
		</>
	);
};

const paidAmount = (bill: BillDTO) => (bill.amount ?? 0) - (bill.balance ?? 0);
const notPaidAmount = (bill: BillDTO) => bill.balance ?? 0;
const sumBy = (bills: BillDTO[], fn: (bill: BillDTO) => number) =>
	bills.reduce((total, bill) => total + fn(bill), 0);

const PAGE_SIZE = 10;
const statusParam = (tab: TStatusTab) => (tab === 'ALL' ? undefined : tab);

type TFilterValues = {
	fromDate: string;
	toDate: string;
	patientCode: number;
	guarantor: string;
};

export const BillsListing: FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const currentUsername = useAppSelector(
		(state) => state.main.authentication?.data?.username,
	);
	const userList = useAppSelector(selectUserList);
	const billsPage = useAppSelector(selectBillsPage);
	const billsSummary = useAppSelector(selectBillsSummary);
	const isLoading = useAppSelector(selectSearchBillsPageableLoading);
	const rawError = useAppSelector(selectSearchBillsPageableError);

	const [statusTab, setStatusTab] = useState<TStatusTab>('ALL');
	const [quickRange, setQuickRange] = useState<TQuickRange>('today');
	const [monthPickerAnchor, setMonthPickerAnchor] =
		useState<HTMLElement | null>(null);
	const [yearPickerAnchor, setYearPickerAnchor] = useState<HTMLElement | null>(
		null,
	);
	const [page, setPage] = useState(0);

	const today = useMemo(() => new Date(), []);

	const initialValues: TFilterValues = {
		fromDate: startOfDay(today).toISOString(),
		toDate: endOfDay(today).toISOString(),
		patientCode: 0,
		guarantor: '',
	};

	const validationSchema = object({
		fromDate: string().required(),
		toDate: string().required(),
	});

	// Real server-side pagination: fetches exactly one page (PAGE_SIZE rows) for
	// the current filters + status tab.
	const fetchPage = useCallback(
		(values: TFilterValues, status: TStatusTab, pageIndex: number) =>
			dispatch(
				searchBillsPageable({
					datefrom: values.fromDate,
					dateto: values.toDate,
					patientCode: values.patientCode || undefined,
					guarantor: values.guarantor || undefined,
					status: statusParam(status),
					page: pageIndex,
					size: PAGE_SIZE,
				}),
			),
		[dispatch],
	);

	// Separate, status-agnostic, unpaginated-ish fetch backing status-tab counts
	// and the summary cards (needs the whole filtered set, not just one page).
	const fetchSummary = useCallback(
		(values: TFilterValues) => {
			dispatch(
				searchBillsSummary({
					datefrom: values.fromDate,
					dateto: values.toDate,
					patientCode: values.patientCode || undefined,
					guarantor: values.guarantor || undefined,
					page: 0,
					size: 1000,
				}),
			);
		},
		[dispatch],
	);

	const runSearch = useCallback(
		(values: TFilterValues) => {
			setPage(0);
			fetchPage(values, statusTab, 0).finally(() => fetchSummary(values));
		},
		[fetchPage, fetchSummary, statusTab],
	);

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: runSearch,
	});

	const { setFieldValue, handleBlur, values } = formik;

	// biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount only
	useEffect(() => {
		dispatch(getUsers({}));
		fetchPage(initialValues, 'ALL', 0).finally(() =>
			fetchSummary(initialValues),
		);
	}, []);

	const applyQuickRange = (range: TQuickRange) => {
		setQuickRange(range);
		if (range === 'custom' || range === 'pickMonth' || range === 'pickYear') {
			return;
		}
		const now = new Date();
		let from = startOfDay(now);
		let to = endOfDay(now);
		if (range === 'last7') {
			from = startOfDay(
				new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
			);
		} else if (range === 'thisMonth') {
			from = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
			to = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
		}
		setFieldValue('fromDate', from.toISOString());
		setFieldValue('toDate', to.toISOString());
		runSearch({
			...values,
			fromDate: from.toISOString(),
			toDate: to.toISOString(),
		});
	};

	const applyPickedMonth = (date: Date | null) => {
		setMonthPickerAnchor(null);
		if (!date) {
			return;
		}
		setQuickRange('pickMonth');
		const from = startOfDay(new Date(date.getFullYear(), date.getMonth(), 1));
		const to = endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
		setFieldValue('fromDate', from.toISOString());
		setFieldValue('toDate', to.toISOString());
		runSearch({
			...values,
			fromDate: from.toISOString(),
			toDate: to.toISOString(),
		});
	};

	const applyPickedYear = (date: Date | null) => {
		setYearPickerAnchor(null);
		if (!date) {
			return;
		}
		setQuickRange('pickYear');
		const from = startOfDay(new Date(date.getFullYear(), 0, 1));
		const to = endOfDay(new Date(date.getFullYear(), 11, 31));
		setFieldValue('fromDate', from.toISOString());
		setFieldValue('toDate', to.toISOString());
		runSearch({
			...values,
			fromDate: from.toISOString(),
			toDate: to.toISOString(),
		});
	};

	const resetFilters = () => {
		formik.resetForm({ values: initialValues });
		setStatusTab('ALL');
		setQuickRange('today');
		setPage(0);
		fetchPage(initialValues, 'ALL', 0).finally(() =>
			fetchSummary(initialValues),
		);
	};

	const onBlurCallback = useCallback(
		(fieldName: keyof TFilterValues) =>
			(e: React.FocusEvent<HTMLInputElement>, value: any) => {
				handleBlur(e);
				setQuickRange('custom');
				const resolvedValue: string | number =
					typeof value === 'string' ? value : (value?.code ?? 0);
				setFieldValue(fieldName, resolvedValue);
				runSearch({ ...values, [fieldName]: resolvedValue });
			},
		[setFieldValue, handleBlur, runSearch, values],
	);

	// Guards against a real race: if the user (or a fast automated click) triggers
	// a status-tab or page change while the previous fetch is still in flight, two
	// concurrent searchBillsPageable calls would race to update the same state slot.
	const handleStatusTabClick = useCallback(
		(tab: TStatusTab) => {
			if (isLoading) {
				return;
			}
			setStatusTab(tab);
			setPage(0);
			fetchPage(values, tab, 0);
		},
		[fetchPage, values, isLoading],
	);

	const handlePageChange = useCallback(
		(_event: unknown, newPage: number) => {
			if (isLoading) {
				return;
			}
			setPage(newPage);
			fetchPage(values, statusTab, newPage);
		},
		[fetchPage, values, statusTab, isLoading],
	);

	// One page of server-filtered (status + date + patient + guarantor) rows — what the table shows.
	const pageBills: BillDTO[] = billsPage?.data ?? [];
	const pageInfo = billsPage?.pageInfo;

	// Whole filtered set (status-agnostic, up to 1000 rows) — backs tab counts + summary cards.
	const summaryBills: BillDTO[] = billsSummary?.data ?? [];

	const counts = useMemo(
		() => ({
			ALL: summaryBills.length,
			O: summaryBills.filter((b) => b.status === 'O').length,
			C: summaryBills.filter((b) => b.status === 'C').length,
		}),
		[summaryBills],
	);

	const todayBills = useMemo(
		() => summaryBills.filter((b) => isSameDay(b.date, today)),
		[summaryBills, today],
	);
	const myBills = useMemo(
		() => summaryBills.filter((b) => b.user === currentUsername),
		[summaryBills, currentUsername],
	);
	const myTodayBills = useMemo(
		() => myBills.filter((b) => isSameDay(b.date, today)),
		[myBills, today],
	);

	const statusLabel = useCallback(
		(status?: string) => {
			switch (status) {
				case 'C':
					return t('bill.closed');
				case 'O':
					return t('bill.pending');
				case 'D':
					return t('bill.deleted');
				default:
					return t('bill.unknown');
			}
		},
		[t],
	);

	const header = [
		'id',
		'date',
		'patient',
		'type',
		'amount',
		'balance',
		'lastPayment',
		'status',
		'user',
	];
	const dateFields = ['date'];
	// 'balance' is rendered as JSX (conditional color) like 'type'/'status' below,
	// so — same as those — it's excluded here: Table's sort comparator does
	// `a[key] < b[key]` directly on the cell value, which breaks on JSX nodes.
	const columnsOrder = ['date', 'amount'];
	const label = {
		id: t('bill.billid'),
		date: t('bill.date'),
		patient: t('bill.patient'),
		type: t('accounting.bills.columns.type'),
		amount: t('bill.amount'),
		balance: t('bill.balance'),
		lastPayment: t('bill.lastPayment'),
		status: t('bill.status'),
		user: t('bill.cashier'),
	};

	const rowData = useMemo(
		() =>
			pageBills.map((bill) => ({
				billId: bill.id,
				id: <span className={classes.billId}>#{bill.id}</span>,
				date: bill.date ? renderDate(bill.date) : '',
				patient: bill.patName ?? '',
				type: (
					<Chip
						size="small"
						label={
							bill.admissionId
								? t('accounting.bills.type.ipd')
								: t('accounting.bills.type.opd')
						}
						className={classNames(classes.chip, {
							[classes.chipIpd]: !!bill.admissionId,
							[classes.chipOpd]: !bill.admissionId,
						})}
					/>
				),
				amount: currencyFormat(bill.amount),
				balance: (
					<span
						className={bill.balance ? classes.balanceDue : classes.balanceZero}
					>
						{currencyFormat(bill.balance)}
					</span>
				),
				lastPayment: bill.update ? renderDateTime(bill.update) : '—',
				status: (
					<Chip
						size="small"
						label={statusLabel(bill.status)}
						className={classNames(classes.chip, {
							[classes.chipClosed]: bill.status === 'C',
							[classes.chipPending]: bill.status === 'O',
							[classes.chipDeleted]: bill.status === 'D',
						})}
					/>
				),
				user: bill.user ?? '',
			})),
		[pageBills, t, statusLabel],
	);

	// Plain (non-JSX) counterpart of `rowData`, keyed the same way, so Table's
	// built-in column filters can compare against real values instead of Chips.
	const rawFilterData = useMemo(
		() =>
			pageBills.map((bill) => ({
				billId: bill.id,
				patient: bill.patName ?? '',
				type: bill.admissionId
					? t('accounting.bills.type.ipd')
					: t('accounting.bills.type.opd'),
				status: bill.status,
				user: bill.user ?? '',
			})),
		[pageBills, t],
	);

	const filters: TFilterField[] = [
		{ key: 'patient', label: t('bill.patient'), type: 'text' },
		{
			key: 'type',
			label: t('accounting.bills.columns.type'),
			type: 'select',
			options: [
				{
					value: t('accounting.bills.type.opd'),
					label: t('accounting.bills.type.opd'),
				},
				{
					value: t('accounting.bills.type.ipd'),
					label: t('accounting.bills.type.ipd'),
				},
			],
		},
		{
			key: 'status',
			label: t('bill.status'),
			type: 'select',
			options: [
				{ value: 'O', label: t('bill.pending') },
				{ value: 'C', label: t('bill.closed') },
			],
		},
		{ key: 'user', label: t('bill.cashier'), type: 'text' },
	];

	const guarantorOptions = [
		{ value: '', label: t('accounting.bills.allUsers') },
		...(userList ?? []).map((u) => ({
			value: u.userName ?? '',
			label: u.userName ?? '',
		})),
	];

	const noop = () => {};

	return (
		<div className={classes.billsListing} data-cy="bills-listing">
			<div className={classes.filterBar}>
				<form
					className={classes.filterForm}
					onSubmit={formik.handleSubmit}
					data-cy="bills-filter-form"
				>
					<div
						className={classNames(classes.filterItem, classes.filterItemWide)}
					>
						<PatientPicker
							theme="regular"
							fieldName="patientCode"
							fieldValue={values.patientCode}
							label={t('bill.patient')}
							isValid={false}
							errorText=""
							onBlur={onBlurCallback('patientCode')}
						/>
					</div>
					<div className={classes.filterItem}>
						<DateField
							fieldName="fromDate"
							fieldValue={values.fromDate}
							disableFuture={false}
							theme="regular"
							format="dd/MM/yyyy"
							isValid={false}
							errorText=""
							label={t('bill.fromdate')}
							onChange={(value) => {
								setQuickRange('custom');
								setFieldValue('fromDate', value?.toISOString() ?? '');
							}}
						/>
					</div>
					<div className={classes.filterItem}>
						<DateField
							fieldName="toDate"
							fieldValue={values.toDate}
							disableFuture={false}
							theme="regular"
							format="dd/MM/yyyy"
							isValid={false}
							errorText=""
							label={t('bill.todate')}
							onChange={(value) => {
								setQuickRange('custom');
								setFieldValue('toDate', value?.toISOString() ?? '');
							}}
						/>
					</div>
					<div className={classes.filterItem}>
						<SelectField
							fieldName="guarantor"
							fieldValue={values.guarantor}
							label={t('accounting.bills.guarantor')}
							isValid={false}
							errorText=""
							options={guarantorOptions}
							onBlur={onBlurCallback('guarantor')}
							onChange={(value) => {
								setQuickRange('custom');
								setFieldValue('guarantor', value);
							}}
						/>
					</div>
					<div
						className={classNames(classes.filterItem, classes.filterButtons)}
					>
						<Button
							variant="contained"
							type="submit"
							dataCy="bills-search-button"
						>
							{t('accounting.bills.search')}
						</Button>
						<Button variant="outlined" type="button" onClick={resetFilters}>
							{t('accounting.bills.reset')}
						</Button>
					</div>
				</form>
				<div className={classes.quickRange}>
					{(
						[
							['today', t('bill.today')],
							['last7', t('accounting.bills.quickRange.last7days')],
							['thisMonth', t('accounting.bills.quickRange.thisMonth')],
						] as [TQuickRange, string][]
					).map(([value, text]) => (
						<button
							key={value}
							type="button"
							className={classNames(classes.quickRangeChip, {
								[classes.active]: quickRange === value,
							})}
							onClick={() => applyQuickRange(value)}
						>
							{text}
						</button>
					))}
					<button
						type="button"
						className={classNames(classes.quickRangeChip, {
							[classes.active]: quickRange === 'pickMonth',
						})}
						onClick={(e) => setMonthPickerAnchor(e.currentTarget)}
					>
						{t('accounting.bills.quickRange.pickMonth')}
					</button>
					<button
						type="button"
						className={classNames(classes.quickRangeChip, {
							[classes.active]: quickRange === 'pickYear',
						})}
						onClick={(e) => setYearPickerAnchor(e.currentTarget)}
					>
						{t('accounting.bills.quickRange.pickYear')}
					</button>
					<Popover
						open={Boolean(monthPickerAnchor)}
						anchorEl={monthPickerAnchor}
						onClose={() => setMonthPickerAnchor(null)}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
					>
						<StaticDatePicker
							views={['year', 'month']}
							openTo="month"
							onAccept={applyPickedMonth}
							onChange={applyPickedMonth}
							slotProps={{ actionBar: { actions: [] } }}
						/>
					</Popover>
					<Popover
						open={Boolean(yearPickerAnchor)}
						anchorEl={yearPickerAnchor}
						onClose={() => setYearPickerAnchor(null)}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
					>
						<StaticDatePicker
							views={['year']}
							openTo="year"
							onAccept={applyPickedYear}
							onChange={applyPickedYear}
							slotProps={{ actionBar: { actions: [] } }}
						/>
					</Popover>
				</div>
			</div>

			<div className={classes.summaryCards}>
				<div className={classes.summaryCard}>
					<div className={classes.summaryCardTitle}>{t('bill.today')}</div>
					<div className={classes.summaryCardRow}>
						<div>
							<span className={classes.summaryLabel}>
								{t('bill.totalpaid')}
							</span>
							<span className={classes.summaryValue}>
								<CardAmount num={sumBy(todayBills, paidAmount)} />
							</span>
						</div>
						<div>
							<span className={classes.summaryLabel}>{t('bill.notpaid')}</span>
							<span className={classNames(classes.summaryValue, classes.warn)}>
								<CardAmount num={sumBy(todayBills, notPaidAmount)} />
							</span>
						</div>
					</div>
				</div>
				<div className={classes.summaryCard}>
					<div className={classes.summaryCardTitle}>
						{t('accounting.bills.summary.selectedPeriod')}
					</div>
					<div className={classes.summaryCardRow}>
						<div>
							<span className={classes.summaryLabel}>
								{t('bill.totalpaid')}
							</span>
							<span className={classes.summaryValue}>
								<CardAmount num={sumBy(summaryBills, paidAmount)} />
							</span>
						</div>
						<div>
							<span className={classes.summaryLabel}>{t('bill.notpaid')}</span>
							<span className={classNames(classes.summaryValue, classes.warn)}>
								<CardAmount num={sumBy(summaryBills, notPaidAmount)} />
							</span>
						</div>
					</div>
				</div>
				<div
					className={classNames(classes.summaryCard, classes.summaryCardDark)}
				>
					<div className={classes.summaryCardTitle}>
						{t('accounting.bills.summary.myCash', {
							user: currentUsername ?? '',
						})}
					</div>
					<div className={classes.summaryCardRow}>
						<div>
							<span className={classes.summaryLabel}>{t('bill.today')}</span>
							<span className={classes.summaryValue}>
								<CardAmount num={sumBy(myTodayBills, paidAmount)} />
							</span>
						</div>
						<div>
							<span className={classes.summaryLabel}>{t('bill.period')}</span>
							<span className={classes.summaryValue}>
								<CardAmount num={sumBy(myBills, paidAmount)} />
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className={classes.statusTabsBar}>
				<div className={classes.statusTabs}>
					{(
						[
							['ALL', t('bill.allbills')],
							['O', t('bill.pending')],
							['C', t('bill.closed')],
						] as [TStatusTab, string][]
					).map(([value, text]) => (
						<button
							key={value}
							type="button"
							role="tab"
							aria-selected={statusTab === value}
							data-cy={`bills-status-tab-${value}`}
							className={classNames(classes.statusTab, {
								[classes.active]: statusTab === value,
							})}
							onClick={() => handleStatusTabClick(value)}
						>
							{text}
							<span className={classes.statusTabCount}>{counts[value]}</span>
						</button>
					))}
				</div>
				<div className={classes.tabActions}>
					<span className={classes.tabActionsHint}>
						{t('accounting.bills.selectHint')}
					</span>
					<Button
						variant="outlined"
						color="inherit"
						type="button"
						dataCy="bills-refund-button"
						onClick={noop}
					>
						<Replay fontSize="small" className={classes.tabActionIcon} />
						{t('accounting.bills.refund')}
					</Button>
				</div>
			</div>

			{isLoading ? (
				<CircularProgress style={{ marginLeft: '50%', position: 'relative' }} />
			) : rawError ? (
				<InfoBox
					type="error"
					message={rawError?.message ?? t('common.somethingwrong')}
				/>
			) : pageBills.length === 0 ? (
				<InfoBox type="info" message={t('common.emptydata')} />
			) : (
				<>
					<Table
						rowData={rowData}
						rawData={rawFilterData}
						rowKey="billId"
						dateFields={dateFields}
						tableHeader={header}
						labelData={label}
						columnsOrder={columnsOrder}
						filterColumns={filters}
						manualFilter={false}
						rowsPerPage={PAGE_SIZE}
						hidePaginator={true}
						initialOrderBy="date"
						onView={noop}
						onEdit={noop}
						onPrint={noop}
					/>
					<TablePagination
						component="div"
						data-cy="bills-pagination"
						count={pageInfo?.totalNbOfElements ?? 0}
						page={page}
						rowsPerPage={PAGE_SIZE}
						rowsPerPageOptions={[PAGE_SIZE]}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</div>
	);
};

export default BillsListing;
