import type {
	BillDTO,
	BillPaymentsDTO,
	FullBillDTO,
	PageBillDTO,
} from '../../generated';
import type { ApiResponse } from '../types';

export type IBillsState = {
	newBill: ApiResponse<FullBillDTO>;
	updateBill: ApiResponse<FullBillDTO>;
	getBill: ApiResponse<BillDTO>;
	searchBills: ApiResponse<FullBillDTO[]>;
	searchBillsPageable: ApiResponse<PageBillDTO>;
	searchBillsSummary: ApiResponse<PageBillDTO>;
	getPendingBills: ApiResponse<FullBillDTO[]>;
	searchPayments: ApiResponse<BillPaymentsDTO[]>;
	delete: ApiResponse<void>;
	payBill: ApiResponse<FullBillDTO>;
	closeBill: ApiResponse<FullBillDTO>;
	getBillsByYear: ApiResponse<FullBillDTO[]>;
};
