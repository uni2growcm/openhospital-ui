import { of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { reportsApi } from '~/state/reports';
import {
	apiDate,
	defaultReportValues,
	reportFileName,
	splitStatisticTitle,
	statisticDefinition,
	type TReportValues,
} from './catalog';

// The real API client needs the browser storage: only the calls are checked here
vi.mock('~/state/reports', () => ({
	reportsApi: { downloadStatisticReport: vi.fn() },
}));

const values: TReportValues = {
	...defaultReportValues(),
	fromDate: '2026-01-01',
	toDate: '2026-01-31',
	month: '3',
	year: '2026',
};

describe('statisticDefinition', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('sends fromDate and toDate for a DATE_RANGE report', () => {
		const spy = vi
			.spyOn(reportsApi, 'downloadStatisticReport')
			.mockReturnValue(of(new Blob()) as any);
		const report = statisticDefinition({
			folder: 'rpt_stat',
			fileName: 'OH001_RegisteredPatients',
			title: 'Registered patients',
			parameterType: 'DATE_RANGE',
		});

		report.print(values, 'xlsx');

		expect(report.params).toEqual(['dateRange']);
		expect(spy).toHaveBeenCalledWith({
			folder: 'rpt_stat',
			fileName: 'OH001_RegisteredPatients',
			format: 'xlsx',
			fromDate: new Date('2026-01-01'),
			toDate: new Date('2026-01-31'),
		});
		expect(reportFileName(report, values, 'xlsx')).toBe(
			'OH001_RegisteredPatients_2026-01-01_2026-01-31.xlsx',
		);
	});

	it('sends month and year for a MONTH_YEAR report', () => {
		const spy = vi
			.spyOn(reportsApi, 'downloadStatisticReport')
			.mockReturnValue(of(new Blob()) as any);
		const report = statisticDefinition({
			folder: 'rpt_extra',
			fileName: 'hmis105_opd_attendance',
			title: 'HMIS 105 - OPD attendance',
			parameterType: 'MONTH_YEAR',
		});

		expect(report.id).toBe('rpt_extra/hmis105_opd_attendance');
		expect(report.code).toBe('HMIS 105');
		expect(report.title).toBe('OPD attendance');

		report.print(values, 'pdf');

		expect(report.params).toEqual(['monthYear']);
		expect(spy).toHaveBeenCalledWith({
			folder: 'rpt_extra',
			fileName: 'hmis105_opd_attendance',
			format: 'pdf',
			month: 3,
			year: 2026,
		});
		expect(reportFileName(report, values, 'pdf')).toBe(
			'hmis105_opd_attendance_2026_03.pdf',
		);
	});

	it('asks no parameter for a NONE report', () => {
		const report = statisticDefinition({
			folder: 'rpt_stat',
			fileName: 'OH099_Static',
			parameterType: 'NONE',
		});

		expect(report.params).toEqual([]);
		expect(report.title).toBe('OH099_Static');
	});
});

describe('splitStatisticTitle', () => {
	it('splits the code from the description', () => {
		expect(
			splitStatisticTitle(
				'HMIS 105 - OPD by diagnosis',
				'hmis105_opd_by_diagnosis',
			),
		).toEqual({ code: 'HMIS 105', description: 'OPD by diagnosis' });
	});

	it('keeps the dashes of the description', () => {
		expect(
			splitStatisticTitle(
				'MOH 705A - Under 5 Years - Daily Outpatient Morbidity Summary Sheet',
				'MOH705A',
			),
		).toEqual({
			code: 'MOH 705A',
			description: 'Under 5 Years - Daily Outpatient Morbidity Summary Sheet',
		});
	});

	it('falls back on the file name when the title has no code', () => {
		expect(splitStatisticTitle('Registered patients', 'OH001')).toEqual({
			code: 'OH001',
			description: 'Registered patients',
		});
		expect(splitStatisticTitle(undefined, 'OH099_Static')).toEqual({
			code: 'OH099_Static',
			description: 'OH099_Static',
		});
	});
});

describe('apiDate', () => {
	it('keeps the same day once serialized by the generated client', () => {
		const date = apiDate('2026-01-31') as unknown as Date;

		expect(date.toISOString().split('T')[0]).toBe('2026-01-31');
	});
});

describe('defaultReportValues', () => {
	it('defaults the period to the last 7 days', () => {
		const defaults = defaultReportValues();

		const days =
			(new Date(defaults.toDate).getTime() -
				new Date(defaults.fromDate).getTime()) /
			(24 * 60 * 60 * 1000);

		expect(days).toBe(7);
		expect(Number(defaults.month)).toBe(new Date().getMonth() + 1);
		expect(Number(defaults.year)).toBe(new Date().getFullYear());
	});
});
