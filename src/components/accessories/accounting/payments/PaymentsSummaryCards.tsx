import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatAmount } from './formatAmount';
import classes from './PaymentsSummaryCards.module.scss';
import type { IPaymentsSummaryCardsProps } from './types';

export const PaymentsSummaryCards: FC<IPaymentsSummaryCardsProps> = ({
	payments,
	currencyCode,
}) => {
	const { t } = useTranslation();

	const { total, billCount, byUser } = useMemo(() => {
		const totalAmount = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);
		const distinctBills = new Set(payments.map((p) => p.billId));

		const amountsByUser = new Map<string, number>();
		for (const payment of payments) {
			const user = payment.user ?? '';
			amountsByUser.set(
				user,
				(amountsByUser.get(user) ?? 0) + (payment.amount ?? 0),
			);
		}

		return {
			total: totalAmount,
			billCount: distinctBills.size,
			byUser: Array.from(amountsByUser.entries()).sort((a, b) => b[1] - a[1]),
		};
	}, [payments]);

	return (
		<div data-cy="payments-summary-cards" className={classes.summaryCards}>
			<div className={classes.card}>
				<div className={classes.cardLabel}>
					{t('accounting.payments.totalReceived')}
				</div>
				<div className={classes.cardValue}>
					{formatAmount(total)}
					{currencyCode ? (
						<span className={classes.cardUnit}>{currencyCode}</span>
					) : null}
				</div>
			</div>

			<div className={classes.card}>
				<div className={classes.cardLabel}>
					{t('accounting.payments.payments')}
				</div>
				<div className={classes.cardValue}>{payments.length}</div>
				<div className={classes.cardFootnote}>
					{t('accounting.payments.onNBills', { count: billCount })}
				</div>
			</div>

			{byUser.map(([user, amount]) => (
				<div
					data-cy={`payments-summary-card-${user}`}
					key={user}
					className={classes.card}
				>
					<div className={classes.cardLabel}>{user}</div>
					<div className={classes.cardValue}>{formatAmount(amount)}</div>
					<div className={classes.progressTrack}>
						<div
							className={classes.progressFill}
							style={{ width: `${total > 0 ? (amount / total) * 100 : 0}%` }}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default PaymentsSummaryCards;
