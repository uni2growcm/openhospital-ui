import type { StatisticReportDTO } from '~/generated';

export const statisticReports: StatisticReportDTO[] = [
	{
		folder: 'rpt_stat',
		fileName: 'OH001_RegisteredPatients',
		title: 'OH001 - Registered patients',
		parameterType: 'DATE_RANGE',
	},
	{
		folder: 'rpt_stat',
		fileName: 'OH002_OutpatientRegister',
		title: 'OH002 - Outpatient register',
		parameterType: 'MONTH_YEAR',
	},
	{
		folder: 'rpt_extra',
		fileName: 'hmis105_opd_attendance',
		title: 'HMIS 105 - OPD attendance',
		parameterType: 'MONTH_YEAR',
	},
];

/** Content type returned by a report download, according to the requested format */
export const reportContentType = (format: string | null) =>
	format === 'xlsx'
		? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		: format === 'xls'
			? 'application/vnd.ms-excel'
			: 'application/pdf';
