import classNames from 'classnames';
import moment from 'moment';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { BillPaymentsDTO } from '../../../../generated';
import {
	renderDate,
	renderDateTime,
} from '../../../../libraries/formatUtils/dataFormatting';
import Pagination from '../../pagination/Pagination';
import { formatAmount } from './formatAmount';
import classes from './PaymentsListingTable.module.scss';
import type { IPaymentsListingTableProps } from './types';

export const PaymentsListingTable: FC<IPaymentsListingTableProps> = ({
	payments,
	pageRows,
	viewMode,
	onViewModeChange,
	page,
	totalPages,
	pageSize,
	totalElements,
	isLoading,
	onPageChange,
	onPageSizeChange,
}) => {
	const { t } = useTranslation();

	const grandTotal = useMemo(
		() => payments.reduce((sum, p) => sum + (p.amount ?? 0), 0),
		[payments],
	);

	const groupedByDay = useMemo(() => {
		const sorted = [...payments].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
		const groups: {
			day: string;
			payments: BillPaymentsDTO[];
			total: number;
		}[] = [];
		for (const payment of sorted) {
			const day = moment(payment.date).format('YYYY-MM-DD');
			let group = groups.find((g) => g.day === day);
			if (!group) {
				group = { day, payments: [], total: 0 };
				groups.push(group);
			}
			group.payments.push(payment);
			group.total += payment.amount ?? 0;
		}
		return groups;
	}, [payments]);

	const renderRow = (payment: BillPaymentsDTO) => (
		<tr key={payment.id} data-cy="payments-table-row">
			<td className={classes.dateCell}>{renderDateTime(payment.date)}</td>
			<td className={classes.billCell}>#{payment.billId}</td>
			<td>
				<div className={classes.patientName}>{payment.patName}</div>
				{payment.patientCode ? (
					<div className={classes.patientCode}>
						{t('accounting.payments.code', { code: payment.patientCode })}
					</div>
				) : null}
			</td>
			<td>{payment.user}</td>
			<td className={classes.amountCell}>{formatAmount(payment.amount)}</td>
		</tr>
	);

	const isEmpty =
		viewMode === 'list' ? pageRows.length === 0 : payments.length === 0;

	return (
		<div data-cy="payments-listing-table" className={classes.tableContainer}>
			<div className={classes.tableHeaderRow}>
				<h3 className={classes.tableTitle}>{t('accounting.payments.title')}</h3>
				<div className={classes.viewToggle} role="tablist">
					<button
						type="button"
						role="tab"
						data-cy="payments-view-list"
						aria-selected={viewMode === 'list'}
						className={classNames(classes.toggleButton, {
							[classes.active]: viewMode === 'list',
						})}
						onClick={() => onViewModeChange('list')}
					>
						{t('accounting.payments.listView')}
					</button>
					<button
						type="button"
						role="tab"
						data-cy="payments-view-by-day"
						aria-selected={viewMode === 'byDay'}
						className={classNames(classes.toggleButton, {
							[classes.active]: viewMode === 'byDay',
						})}
						onClick={() => onViewModeChange('byDay')}
					>
						{t('accounting.payments.byDayView')}
					</button>
				</div>
			</div>

			<table className={classes.table}>
				<thead>
					<tr>
						<th>{t('accounting.payments.date')}</th>
						<th>{t('accounting.payments.bill')}</th>
						<th>{t('accounting.payments.patient')}</th>
						<th>{t('accounting.payments.receivedBy')}</th>
						<th className={classes.amountHeader}>
							{t('accounting.payments.amount')}
						</th>
					</tr>
				</thead>
				{viewMode === 'list' ? (
					<>
						<tbody>{pageRows.map(renderRow)}</tbody>
						<tfoot>
							<tr className={classes.totalRow}>
								<td colSpan={4}>{t('accounting.payments.total')}</td>
								<td className={classes.amountCell}>
									{formatAmount(grandTotal)}
								</td>
							</tr>
						</tfoot>
					</>
				) : (
					<>
						{groupedByDay.map((group) => (
							<tbody key={group.day}>
								<tr className={classes.dayHeaderRow}>
									<td colSpan={4}>{renderDate(group.day)}</td>
									<td className={classes.amountCell}>
										{formatAmount(group.total)}
									</td>
								</tr>
								{group.payments.map(renderRow)}
							</tbody>
						))}
						<tfoot>
							<tr className={classes.totalRow}>
								<td colSpan={4}>{t('accounting.payments.total')}</td>
								<td className={classes.amountCell}>
									{formatAmount(grandTotal)}
								</td>
							</tr>
						</tfoot>
					</>
				)}
			</table>

			{isEmpty ? (
				<div data-cy="payments-table-empty" className={classes.emptyState}>
					{t('common.emptydata')}
				</div>
			) : null}

			{viewMode === 'list' ? (
				<Pagination
					page={page}
					totalPages={totalPages}
					totalElements={totalElements}
					setPage={onPageChange}
					pageSize={pageSize}
					setPageSize={onPageSizeChange}
					disabled={isLoading}
				/>
			) : null}
		</div>
	);
};

export default PaymentsListingTable;
