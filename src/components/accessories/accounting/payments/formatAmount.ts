const amountFormatter = new Intl.NumberFormat('fr-FR', {
	maximumFractionDigits: 0,
});

export const formatAmount = (amount: number | undefined): string =>
	amountFormatter.format(amount ?? 0);
