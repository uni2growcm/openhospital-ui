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
