export enum AccountingTab {
	OVERVIEW = 'overview',
	BILLS = 'bills',
	PAYMENTS = 'payments',
}

export interface IAccountingHeaderActionsProps {
	activeTab: AccountingTab;
	selectedYear: string;
	onYearChange: (year: string) => void;
	onNewBill?: () => void;
	onReports?: () => void;
	onArchiveClosed?: () => void;
	onExportSage?: () => void;
	onExportPdf?: () => void;
	onExportCsv?: () => void;
	onPaymentsByUserReport?: () => void;
}

export interface IAccountingTabsProps {
	activeTab: AccountingTab;
	onTabChange: (tab: AccountingTab) => void;
}

export interface IAccountingTabPlaceholderProps {
	tab: AccountingTab;
}

export interface IKpiSummary {
	cashedIn: number;
	outstandingDebt: number;
	pendingBillsCount: number;
	billsIssued: number;
	closedBillsCount: number;
	refunded: number;
	refundsCount: number;
}

export interface IMonthlyPaymentsDebts {
	monthIndex: number;
	monthLabel: string;
	paid: number;
	notPaid: number;
}

export interface ITopItem {
	id: string;
	description: string;
	revenue: number;
	percentage: number;
}

export interface IIndebtedPatient {
	id: number | string;
	name: string;
	billsCount: number;
	debt: number;
}

export interface IReportItem {
	key: string;
	labelKey: string;
}

export interface IAccountingOverviewProps {
	selectedYear: string;
}
