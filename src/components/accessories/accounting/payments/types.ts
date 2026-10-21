import type { BillPaymentsDTO } from '../../../../generated';

export type TPaymentsViewMode = 'list' | 'byDay';

export type TPaymentsFilterValues = {
	fromDate: string;
	toDate: string;
	patientCode: number | '';
	user: string;
};

export interface IPaymentsFilterBarProps {
	initialValues: TPaymentsFilterValues;
	users: string[];
	isLoading: boolean;
	onSubmit: (values: TPaymentsFilterValues) => void;
}

export interface IPaymentsSummaryCardsProps {
	payments: BillPaymentsDTO[];
	currencyCode?: string;
}

export interface IPaymentsListingTableProps {
	/** Full date-range filtered payments (not paginated) — drives the "By day" grouping and the grand total. */
	payments: BillPaymentsDTO[];
	/** Current server-side page of payments — drives the "List" view rows. */
	pageRows: BillPaymentsDTO[];
	viewMode: TPaymentsViewMode;
	onViewModeChange: (mode: TPaymentsViewMode) => void;
	page: number;
	totalPages: number;
	pageSize: number;
	totalElements: number;
	isLoading: boolean;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}
