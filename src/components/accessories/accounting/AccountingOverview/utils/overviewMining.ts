import type {
	IIndebtedPatient,
	IKpiSummary,
	IMonthlyPaymentsDebts,
	ITopItem,
} from '~/components/accessories/accounting/types';
import type { FullBillDTO } from '~/generated';

export const MONTH_NAMES = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

export const formatCompactAmount = (value: number | undefined): string => {
	const val = value ?? 0;
	if (Math.abs(val) >= 1_000_000) {
		const m = val / 1_000_000;
		return `${m.toFixed(1)} M`;
	}
	return formatNumberWithSpaces(val);
};

export const formatNumberWithSpaces = (value: number | undefined): string => {
	const val = Math.round(value ?? 0);
	return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const getPeriodLabel = (year: number, locale = 'en'): string => {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();

	const getMonthShort = (monthIndex: number) => {
		const d = new Date(year, monthIndex, 1);
		try {
			return d.toLocaleString(locale, { month: 'short' });
		} catch {
			return MONTH_NAMES[monthIndex];
		}
	};

	const startMonth = getMonthShort(0);
	const endMonthIndex = year === currentYear ? currentMonth : 11;
	const endMonth = getMonthShort(endMonthIndex);

	const formatPart = (str: string) => {
		const clean = str.replace('.', '');
		return clean.charAt(0).toUpperCase() + clean.slice(1);
	};

	return `${formatPart(startMonth)}–${formatPart(endMonth)}`;
};

export const computeKpiSummary = (
	bills: FullBillDTO[],
	year: number,
): IKpiSummary => {
	let cashedIn = 0;
	let outstandingDebt = 0;
	let pendingBillsCount = 0;
	let closedBillsCount = 0;
	let refunded = 0;
	let refundsCount = 0;

	for (const item of bills) {
		const bill = item.bill || (item as any).billDTO;
		if (!bill) continue;

		const rawDate = bill.date || bill.update;
		const billDate = rawDate ? new Date(rawDate) : null;
		if (
			billDate &&
			!Number.isNaN(billDate.getTime()) &&
			billDate.getFullYear() !== year
		) {
			continue;
		}

		if (bill.status === 'C') {
			closedBillsCount++;
		}

		if (bill.status === 'O') {
			outstandingDebt += bill.balance ?? 0;
			pendingBillsCount++;
		}

		const payments = item.billPayments || (item as any).billPaymentsDTO || [];
		if (payments.length > 0) {
			for (const p of payments) {
				const amt = p.amount ?? 0;
				if (amt < 0) {
					refunded += Math.abs(amt);
					refundsCount++;
				}
				cashedIn += amt;
			}
		} else {
			const paidOnBill = (bill.amount ?? 0) - (bill.balance ?? 0);
			cashedIn += paidOnBill;
		}
	}

	return {
		cashedIn,
		outstandingDebt,
		pendingBillsCount,
		billsIssued: bills.length,
		closedBillsCount,
		refunded,
		refundsCount,
	};
};

export const computeMonthlyPaymentsDebts = (
	bills: FullBillDTO[],
	year: number,
): IMonthlyPaymentsDebts[] => {
	const monthly: IMonthlyPaymentsDebts[] = MONTH_NAMES.map((label, index) => ({
		monthIndex: index,
		monthLabel: label,
		paid: 0,
		notPaid: 0,
	}));

	for (const item of bills) {
		const bill = item.bill || (item as any).billDTO;
		if (!bill) continue;

		const rawDate = bill.date || bill.update;
		const billDate = rawDate ? new Date(rawDate) : null;
		if (
			billDate &&
			!Number.isNaN(billDate.getTime()) &&
			billDate.getFullYear() !== year
		) {
			continue;
		}

		const month =
			billDate && !Number.isNaN(billDate.getTime()) ? billDate.getMonth() : 0;
		if (month < 0 || month > 11) continue;

		if (bill.status === 'O') {
			monthly[month].notPaid += bill.balance ?? 0;
		}

		const payments = item.billPayments || (item as any).billPaymentsDTO || [];
		if (payments.length > 0) {
			for (const p of payments) {
				const pDate = p.date ? new Date(p.date) : billDate;
				const pMonth =
					pDate &&
					!Number.isNaN(pDate.getTime()) &&
					pDate.getFullYear() === year
						? pDate.getMonth()
						: month;
				if (pMonth >= 0 && pMonth <= 11) {
					monthly[pMonth].paid += p.amount ?? 0;
				}
			}
		} else {
			const paid = (bill.amount ?? 0) - (bill.balance ?? 0);
			monthly[month].paid += paid;
		}
	}

	return monthly.map((m) => ({
		...m,
		paid: Math.max(0, m.paid),
		notPaid: Math.max(0, m.notPaid),
	}));
};

export const computeTopItems = (
	bills: FullBillDTO[],
	year: number,
	maxCount = 5,
): ITopItem[] => {
	const itemMap = new Map<string, { description: string; revenue: number }>();

	for (const item of bills) {
		const bill = item.bill || (item as any).billDTO;
		if (!bill) continue;

		const rawDate = bill.date || bill.update;
		const billDate = rawDate ? new Date(rawDate) : null;
		if (
			billDate &&
			!Number.isNaN(billDate.getTime()) &&
			billDate.getFullYear() !== year
		) {
			continue;
		}

		const items = item.billItems || (item as any).billItemsDTO || [];
		for (const it of items) {
			const key =
				it.itemDisplayCode || it.itemDescription || it.priceId || 'Unknown';
			const description = it.itemDescription || key;
			const qty = it.itemQuantity ?? 1;
			const unitPrice = it.itemAmount ?? 0;
			const totalAmount = unitPrice * qty;

			const existing = itemMap.get(key) || { description, revenue: 0 };
			existing.revenue += totalAmount;
			itemMap.set(key, existing);
		}
	}

	const sorted = Array.from(itemMap.entries())
		.map(([id, val]) => ({
			id,
			description: val.description,
			revenue: val.revenue,
			percentage: 100,
		}))
		.sort((a, b) => b.revenue - a.revenue)
		.slice(0, maxCount);

	const maxRevenue = sorted.length > 0 ? sorted[0].revenue : 1;
	return sorted.map((it) => ({
		...it,
		percentage:
			maxRevenue > 0 ? Math.round((it.revenue / maxRevenue) * 100) : 0,
	}));
};

export const computeIndebtedPatients = (
	bills: FullBillDTO[],
	year: number,
	maxCount = 5,
): IIndebtedPatient[] => {
	const patientMap = new Map<
		string,
		{ id: number | string; name: string; billsCount: number; debt: number }
	>();

	for (const item of bills) {
		const bill = item.bill || (item as any).billDTO;
		if (!bill) continue;

		const rawDate = bill.date || bill.update;
		const billDate = rawDate ? new Date(rawDate) : null;
		if (
			billDate &&
			!Number.isNaN(billDate.getTime()) &&
			billDate.getFullYear() !== year
		) {
			continue;
		}

		if (bill.status === 'O' && (bill.balance ?? 0) > 0) {
			const patId = bill.patient?.code ?? bill.patName ?? 'Unknown';
			const patName =
				bill.patName ||
				(bill.patient
					? `${bill.patient.firstName ?? ''} ${bill.patient.secondName ?? ''}`.trim()
					: 'Patient');
			const key = String(patId);

			const existing = patientMap.get(key) || {
				id: patId,
				name: patName,
				billsCount: 0,
				debt: 0,
			};

			existing.billsCount += 1;
			existing.debt += bill.balance ?? 0;
			patientMap.set(key, existing);
		}
	}

	return Array.from(patientMap.values())
		.sort((a, b) => b.debt - a.debt)
		.slice(0, maxCount);
};
