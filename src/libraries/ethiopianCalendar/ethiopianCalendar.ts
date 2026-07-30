import Kenat, { monthNames, toEC, toGC } from 'kenat';

export interface EthiopianDate {
	year: number;
	month: number;
	day: number;
}

export interface GregorianDate {
	year: number;
	month: number;
	day: number;
}

export const ETHIOPIAN_MONTHS_AMHARIC = monthNames.amharic;
export const ETHIOPIAN_MONTHS_ENGLISH = monthNames.english;

export function ethiopianToGregorian(
	year: number,
	month: number,
	day: number,
): GregorianDate {
	return toGC(year, month, day);
}

export function gregorianToEthiopian(
	year: number,
	month: number,
	day: number,
): EthiopianDate {
	return toEC(year, month, day);
}

export function formatEthiopianDate(
	year: number,
	month: number,
	day: number,
	lang: 'amharic' | 'english' = 'english',
): string {
	const kenat = new Kenat({ year, month, day });
	return kenat.format({ calendar: 'ethiopian', lang });
}

export function formatEthiopianDateShort(
	year: number,
	month: number,
	day: number,
): string {
	const kenat = new Kenat({ year, month, day });
	return kenat.formatShort();
}

export function createKenatFromEthiopian(
	year: number,
	month: number,
	day: number,
): Kenat {
	return new Kenat({ year, month, day });
}

export function createKenatFromGregorian(date: Date): Kenat {
	return new Kenat(date);
}

export function isValidEthiopianDate(
	year: number,
	month: number,
	day: number,
): boolean {
	try {
		const kenat = new Kenat({ year, month, day });
		const eth = kenat.getEthiopian();
		return eth.year === year && eth.month === month && eth.day === day;
	} catch {
		return false;
	}
}

export function getEthiopianMonthDays(year: number, month: number): number {
	if (month === 13) {
		return kenatIsLeapYear(year) ? 6 : 5;
	}
	return 30;
}

function kenatIsLeapYear(year: number): boolean {
	return year % 4 === 3;
}

export function toGregorianISO(
	year: number,
	month: number,
	day: number,
): string {
	const gregorian = ethiopianToGregorian(year, month, day);
	const monthStr = String(gregorian.month).padStart(2, '0');
	const dayStr = String(gregorian.day).padStart(2, '0');
	return `${gregorian.year}-${monthStr}-${dayStr}`;
}

export function getCurrentEthiopianDate(): EthiopianDate {
	const now = new Date();
	return gregorianToEthiopian(
		now.getFullYear(),
		now.getMonth() + 1,
		now.getDate(),
	);
}

export const toEthiopianDate = (date: Date): string => {
	return createKenatFromGregorian(date).format({
		calendar: 'ethiopian',
		lang: 'english'
	});
};