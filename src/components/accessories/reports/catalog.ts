import moment from 'moment';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Observable } from 'rxjs';
import type { StatisticReportDTO } from '~/generated';
import { useAppSelector } from '~/libraries/hooks/redux';
import { reportsApi } from '~/state/reports';

export const REPORT_CATEGORIES = [
	'statistics',
	'pharmacy',
	'wards',
	'accounting',
	'lists',
] as const;

export type TReportCategory = (typeof REPORT_CATEGORIES)[number];

export type TReportFormat = 'pdf' | 'xlsx';

/**
 * Parameters a report can ask for. Each one is rendered as a field of the print dialog.
 * - dateRange: fromDate / toDate
 * - monthYear: month / year
 * - date: a single day
 * - ward / pharmacyWard: a ward (pharmacyWard lists only wards with a pharmacy, empty means main store)
 * - medical, medicalType, search, user
 */
export type TReportParam =
	| 'dateRange'
	| 'monthYear'
	| 'date'
	| 'ward'
	| 'pharmacyWard'
	| 'medical'
	| 'medicalType'
	| 'search'
	| 'user';

export type TReportValues = {
	fromDate: string;
	toDate: string;
	month: string;
	year: string;
	date: string;
	wardCode: string;
	medicalCode: string;
	medicalType: string;
	search: string;
	user: string;
};

export interface IReportDefinition {
	/** Unique identifier, shown in the "Code" column */
	code: string;
	category: TReportCategory;
	title: string;
	params: TReportParam[];
	/** Parameters that must be filled; the others are optional */
	required: TReportParam[];
	formats: TReportFormat[];
	/** Extra check run before printing, returns the translation key of the error */
	validate?: (
		values: TReportValues,
		format: TReportFormat,
	) => string | undefined;
	print: (values: TReportValues, format: TReportFormat) => Observable<Blob>;
	/** Suffix of the downloaded file name, built from the values */
	fileSuffix?: (values: TReportValues) => string;
}

export const API_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * The generated client types `format: date` parameters as strings but calls `toISOString()` on them,
 * so the value must be a Date. A `YYYY-MM-DD` string is parsed as UTC midnight, which keeps the same day.
 */
export const apiDate = (value: string) => new Date(value) as unknown as string;

export const defaultReportValues = (): TReportValues => {
	const today = moment();
	return {
		fromDate: today.clone().subtract(7, 'days').format(API_DATE_FORMAT),
		toDate: today.format(API_DATE_FORMAT),
		month: String(today.month() + 1),
		year: String(today.year()),
		date: today.format(API_DATE_FORMAT),
		wardCode: '',
		medicalCode: '',
		medicalType: '',
		search: '',
		user: '',
	};
};

const dateRangeSuffix = (values: TReportValues) =>
	`${values.fromDate}_${values.toDate}`;

const monthYearSuffix = (values: TReportValues) =>
	`${values.year}_${values.month.padStart(2, '0')}`;

const statisticParams = (
	parameterType: StatisticReportDTO['parameterType'],
): TReportParam[] => {
	switch (parameterType) {
		case 'DATE_RANGE':
			return ['dateRange'];
		case 'MONTH_YEAR':
			return ['monthYear'];
		default:
			return [];
	}
};

export const statisticDefinition = (
	report: StatisticReportDTO,
): IReportDefinition => {
	const params = statisticParams(report.parameterType);
	const isDateRange = params.includes('dateRange');
	return {
		code: report.fileName ?? '',
		category: 'statistics',
		title: report.title || report.fileName || '',
		params,
		required: params,
		formats: ['pdf', 'xlsx'],
		print: (values, format) =>
			reportsApi.downloadStatisticReport({
				folder: report.folder ?? '',
				fileName: report.fileName ?? '',
				format,
				...(isDateRange
					? { fromDate: apiDate(values.fromDate), toDate: apiDate(values.toDate) }
					: { month: Number(values.month), year: Number(values.year) }),
			}),
		fileSuffix: isDateRange ? dateRangeSuffix : monthYearSuffix,
	};
};

/**
 * Reports of the rpt_base folder that are launched, in the GUI, from the modules (pharmacy, wards, accounting)
 * and only need generic parameters. The reports bound to one record (a bill, an admission, a patient...) stay in their module.
 */
const staticDefinitions = (t: (key: string) => string): IReportDefinition[] => [
	// Pharmacy
	{
		code: 'PharmaceuticalStock',
		category: 'pharmacy',
		title: t('reports.list.pharmaceuticalStock'),
		params: ['date', 'medicalType', 'search'],
		required: ['date'],
		formats: ['pdf', 'xlsx'],
		print: (values, format) =>
			reportsApi.printPharmaceuticalStock({
				date: apiDate(values.date),
				filter: `%${values.search.trim()}%`,
				groupBy: values.medicalType || '%%',
				sortBy: 'MDSRT_DESC, MDSR_DESC',
				format,
			}),
		fileSuffix: (values) => values.date,
	},
	{
		code: 'PharmaceuticalAMC',
		category: 'pharmacy',
		title: t('reports.list.pharmaceuticalAMC'),
		params: ['date'],
		required: ['date'],
		formats: ['pdf', 'xlsx'],
		print: (values, format) =>
			reportsApi.printPharmaceuticalAMC({ date: apiDate(values.date), format }),
		fileSuffix: (values) => values.date,
	},
	{
		code: 'ProductLedger',
		category: 'pharmacy',
		title: t('reports.list.stockCard'),
		params: ['dateRange', 'medical', 'pharmacyWard'],
		required: ['dateRange'],
		formats: ['pdf', 'xlsx'],
		validate: (values, format) =>
			format === 'xlsx' && !values.medicalCode
				? 'reports.errors.stockCardExcelMedical'
				: undefined,
		print: (values, format) =>
			reportsApi.printPharmaceuticalStockCard({
				fromDate: apiDate(values.fromDate),
				toDate: apiDate(values.toDate),
				medicalCode: values.medicalCode
					? Number(values.medicalCode)
					: undefined,
				wardCode: values.wardCode || undefined,
				format,
			}),
		fileSuffix: dateRangeSuffix,
	},
	{
		code: 'PharmaceuticalOrder',
		category: 'pharmacy',
		title: t('reports.list.pharmaceuticalOrder'),
		params: [],
		required: [],
		formats: ['pdf'],
		print: () => reportsApi.printPharmaceuticalOrderPdf(),
	},
	{
		code: 'PharmaceuticalStockWard',
		category: 'pharmacy',
		title: t('reports.list.pharmaceuticalStockWard'),
		params: ['pharmacyWard', 'date'],
		required: ['pharmacyWard', 'date'],
		formats: ['pdf'],
		print: (values) =>
			reportsApi.printPharmaceuticalStockWardPdf({
				wardCode: values.wardCode,
				date: apiDate(values.date),
			}),
		fileSuffix: (values) => `${values.wardCode}_${values.date}`,
	},
	// Wards
	{
		code: 'WardVisits',
		category: 'wards',
		title: t('reports.list.wardVisits'),
		params: ['ward', 'date'],
		required: ['ward', 'date'],
		formats: ['pdf'],
		print: (values) =>
			reportsApi.printWardVisitsPdf({
				wardCode: values.wardCode,
				date: apiDate(values.date),
			}),
		fileSuffix: (values) => `${values.wardCode}_${values.date}`,
	},
	// Accounting
	{
		code: 'BillsReportUserInDate',
		category: 'accounting',
		title: t('reports.list.billsUserInDate'),
		params: ['dateRange', 'user'],
		required: ['dateRange', 'user'],
		formats: ['pdf'],
		print: (values) =>
			reportsApi.printBillsUserInDatePdf({
				fromDate: apiDate(values.fromDate),
				toDate: apiDate(values.toDate),
				user: values.user,
			}),
		fileSuffix: (values) => `${values.user}_${dateRangeSuffix(values)}`,
	},
	// Lists
	{
		code: 'ExamsList',
		category: 'lists',
		title: t('reports.list.examsList'),
		params: [],
		required: [],
		formats: ['pdf'],
		print: () => reportsApi.printExamsListPdf(),
	},
	{
		code: 'DiseasesList',
		category: 'lists',
		title: t('reports.list.diseasesList'),
		params: [],
		required: [],
		formats: ['pdf'],
		print: () => reportsApi.printDiseasesListPdf(),
	},
	{
		code: 'OperationsList',
		category: 'lists',
		title: t('reports.list.operationsList'),
		params: [],
		required: [],
		formats: ['pdf'],
		print: () => reportsApi.printOperationsListPdf(),
	},
];

export const reportFileName = (
	report: IReportDefinition,
	values: TReportValues,
	format: TReportFormat,
) => {
	const suffix = report.fileSuffix?.(values);
	return `${report.code}${suffix ? `_${suffix}` : ''}.${format}`;
};

export const useReportDefinitions = (): IReportDefinition[] => {
	const { t } = useTranslation();
	const statistics = useAppSelector((state) => state.reports.statistics.data);

	return useMemo(
		() => [
			...(statistics ?? []).map(statisticDefinition),
			...staticDefinitions(t),
		],
		[statistics, t],
	);
};
