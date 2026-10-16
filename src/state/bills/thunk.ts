import { createAsyncThunk } from '@reduxjs/toolkit';
import { firstValueFrom, forkJoin, type Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { wrapper } from '~/libraries/apiUtils/wrapper';
import type { TFilterValues } from '../../components/accessories/billTable/types';
import {
	type BillDTO,
	type BillItemsDTO,
	type BillPaymentsDTO,
	BillsApi,
	type FullBillDTO,
	type UpdateBillRequest,
} from '../../generated';
import { customConfiguration } from '../../libraries/apiUtils/configuration';

const api = new BillsApi(customConfiguration());

const getPayments = (bills: BillDTO[]): Observable<FullBillDTO[]> => {
	if (bills.length === 0) return of([]);
	const fbills = forkJoin(
		bills.map((bill: BillDTO) => {
			const obs = wrapper(() =>
				api.getPaymentsByBillId({
					billId: bill.id ? bill.id : 0,
				}),
			);
			return obs.pipe(
				map((payments) => {
					return {
						bill: bill,
						billDTO: bill,
						billItems: [] as BillItemsDTO[],
						billItemsDTO: [] as BillItemsDTO[],
						billPayments: payments,
						billPaymentsDTO: payments,
					} as any as FullBillDTO;
				}),
				catchError((_error) =>
					of({
						bill: bill,
						billDTO: bill,
						billItems: [] as BillItemsDTO[],
						billItemsDTO: [] as BillItemsDTO[],
						billPayments: [] as BillPaymentsDTO[],
						billPaymentsDTO: [] as BillPaymentsDTO[],
					} as any as FullBillDTO),
				),
			);
		}),
	);
	return fbills;
};

const getItems = (bills: FullBillDTO[]): Observable<FullBillDTO[]> => {
	if (bills.length === 0) return of([]);
	const fbills = forkJoin(
		bills.map((fbill: FullBillDTO) => {
			const bill = fbill.bill ?? (fbill as any).billDTO;
			const billPayments =
				fbill.billPayments ?? (fbill as any).billPaymentsDTO ?? [];
			const billId = bill?.id ? bill.id : 0;
			const obs = wrapper(() =>
				api.getItems({
					billId,
				}),
			);
			return obs.pipe(
				map((items) => {
					return {
						bill: bill,
						billDTO: bill,
						billItems: items,
						billItemsDTO: items,
						billPayments: billPayments,
						billPaymentsDTO: billPayments,
					} as any as FullBillDTO;
				}),
				catchError((_error) =>
					of({
						...fbill,
						bill: bill,
						billDTO: bill,
						billPayments: billPayments,
						billItems: fbill.billItems ?? (fbill as any).billItemsDTO ?? [],
					} as any as FullBillDTO),
				),
			);
		}),
	);
	return fbills;
};

export const newBill = createAsyncThunk(
	'bills/newBill',
	async (fullBillDTO: FullBillDTO, thunkApi) =>
		firstValueFrom(wrapper(() => api.newBill({ fullBillDTO }))).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);

export const updateBill = createAsyncThunk(
	'bills/updateBill',
	async (payload: UpdateBillRequest, thunkApi) =>
		firstValueFrom(wrapper(() => api.updateBill(payload))).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);

export const getBill = createAsyncThunk(
	'bills/getBill',
	async (id: number, thunkApi) =>
		firstValueFrom(wrapper(() => api.getBill({ id }))).catch((error) =>
			thunkApi.rejectWithValue(error.response),
		),
);

export const getPendingBills = createAsyncThunk(
	'bills/getPendingBills',
	async (patientCode: number, thunkApi) =>
		firstValueFrom(
			wrapper(() => api.getPendingBills({ patientCode }))
				.pipe(
					switchMap((bills) => getPayments(bills)),
					catchError(() => of([])),
				)
				.pipe(
					switchMap((payments) => getItems(payments)),
					catchError(() => of([])),
				),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const searchBills = createAsyncThunk(
	'bills/searchBills',
	async (filter: TFilterValues, thunkApi) =>
		firstValueFrom(
			wrapper(() =>
				api.searchBills({
					datefrom: filter.fromDate,
					dateto: filter.toDate,
					patientCode:
						filter.patientCode && filter.patientCode > 0
							? filter.patientCode
							: undefined,
				}),
			)
				.pipe(
					switchMap((bills) => getPayments(bills)),
					catchError(() => of([])),
				)
				.pipe(
					switchMap((payments) => getItems(payments)),
					catchError(() => of([])),
				),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const searchPayments = createAsyncThunk(
	'bills/searchPayments',
	async (filter: TFilterValues, thunkApi) =>
		firstValueFrom(
			wrapper(() =>
				api.searchBillsPayments({
					datefrom: filter.fromDate,
					dateto: filter.toDate,
					patientCode:
						filter.patientCode && filter.patientCode > 0
							? filter.patientCode
							: undefined,
				}),
			),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const deleteBill = createAsyncThunk(
	'bills/deleteBill',
	async (id: number | undefined, thunkApi) =>
		firstValueFrom(
			wrapper(() =>
				api.deleteBill({
					id: id ?? -1,
				}),
			),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const payBill = createAsyncThunk(
	'bills/payBill',
	async (payload: BillPaymentsDTO, thunkApi) =>
		firstValueFrom(
			wrapper(() =>
				api.updateBill({
					id: payload.billId,
					fullBillDTO: { billPayments: [payload] } as any,
				}),
			),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const closeBill = createAsyncThunk(
	'bills/closeBill',
	async ({ id, bill }: { id: number; bill: BillDTO }, thunkApi) =>
		firstValueFrom(
			wrapper(() => api.updateBill({ id, fullBillDTO: { bill: bill } as any })),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);

export const getBillsByYear = createAsyncThunk(
	'bills/getBillsByYear',
	async (year: number, thunkApi) =>
		firstValueFrom(
			wrapper(() =>
				api.searchBills({
					datefrom: new Date(year, 0, 1).toISOString(),
					dateto: new Date(year, 11, 31).toISOString(),
				}),
			)
				.pipe(
					switchMap((bills) => getPayments(bills)),
					catchError(() => of([])),
				)
				.pipe(
					switchMap((payments) => getItems(payments)),
					catchError(() => of([])),
				),
		).catch((error) => thunkApi.rejectWithValue(error.response)),
);
