import { describe, expect, it } from 'vitest';
import {
	ETHIOPIAN_MONTHS_AMHARIC,
	ETHIOPIAN_MONTHS_ENGLISH,
	ethiopianToGregorian,
	formatEthiopianDate,
	formatEthiopianDateShort,
	getEthiopianMonthDays,
	gregorianToEthiopian,
	isValidEthiopianDate,
	toGregorianISO,
} from './ethiopianCalendar';

describe('Ethiopian Calendar Utilities', () => {
	describe('ethiopianToGregorian', () => {
		it('should convert Ethiopian date to Gregorian date', () => {
			const result = ethiopianToGregorian(2016, 1, 1);
			expect(result).toEqual({ year: 2023, month: 9, day: 12 });
		});

		it('should handle Pagume (13th month)', () => {
			const result = ethiopianToGregorian(2017, 13, 5);
			expect(result.year).toBe(2025);
			expect(result.month).toBe(9);
			expect(result.day).toBe(10);
		});
	});

	describe('gregorianToEthiopian', () => {
		it('should convert Gregorian date to Ethiopian date', () => {
			const result = gregorianToEthiopian(2024, 9, 11);
			expect(result).toEqual({ year: 2017, month: 1, day: 1 });
		});

		it('should handle September 12 (Ethiopian New Year)', () => {
			const result = gregorianToEthiopian(2024, 9, 12);
			expect(result).toEqual({ year: 2017, month: 1, day: 2 });
		});
	});

	describe('formatEthiopianDate', () => {
		it('should format date in English', () => {
			const result = formatEthiopianDate(2017, 1, 1, 'english');
			expect(result).toContain('Meskerem');
			expect(result).toContain('2017');
		});

		it('should format date in Amharic', () => {
			const result = formatEthiopianDate(2017, 1, 1, 'amharic');
			expect(result).toContain('መስከረም');
			expect(result).toContain('2017');
		});
	});

	describe('formatEthiopianDateShort', () => {
		it('should format date in short format', () => {
			const result = formatEthiopianDateShort(2017, 1, 1);
			expect(result).toMatch(/^2017\/\d{2}\/\d{2}$/);
		});
	});

	describe('isValidEthiopianDate', () => {
		it('should return true for valid date', () => {
			expect(isValidEthiopianDate(2017, 1, 1)).toBe(true);
		});

		it('should return false for invalid month', () => {
			expect(isValidEthiopianDate(2017, 14, 1)).toBe(false);
		});

		it('should return false for invalid day', () => {
			expect(isValidEthiopianDate(2017, 1, 31)).toBe(false);
		});

		it('should return false for invalid date in Pagume', () => {
			expect(isValidEthiopianDate(2017, 13, 7)).toBe(false);
		});
	});

	describe('getEthiopianMonthDays', () => {
		it('should return 30 for regular months', () => {
			expect(getEthiopianMonthDays(2017, 1)).toBe(30);
			expect(getEthiopianMonthDays(2017, 12)).toBe(30);
		});

		it('should return 6 for Pagume in leap year', () => {
			expect(getEthiopianMonthDays(2019, 13)).toBe(6);
		});

		it('should return 5 for Pagume in non-leap year', () => {
			expect(getEthiopianMonthDays(2017, 13)).toBe(5);
		});
	});

	describe('toGregorianISO', () => {
		it('should return ISO format string', () => {
			const result = toGregorianISO(2017, 1, 1);
			expect(result).toBe('2024-09-11');
		});

		it('should pad month and day with zeros', () => {
			const result = toGregorianISO(2017, 1, 5);
			expect(result).toBe('2024-09-15');
		});
	});

	describe('monthNames', () => {
		it('should have 13 Ethiopian months in Amharic', () => {
			expect(ETHIOPIAN_MONTHS_AMHARIC).toHaveLength(13);
		});

		it('should have 13 Ethiopian months in English', () => {
			expect(ETHIOPIAN_MONTHS_ENGLISH).toHaveLength(13);
		});

		it('should start with Meskerem', () => {
			expect(ETHIOPIAN_MONTHS_ENGLISH[0]).toBe('Meskerem');
		});
	});
});
