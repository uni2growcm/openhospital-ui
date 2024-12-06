/**
 * Parse a date from 'YYYYMMDD' format
 * @param value - The value to parse
 * @returns the parsed date or null if the format wasn't correct
 */
export function parseNumericDate(value: string) {
  if (!/^(\d){8}$/.test(value)) return null;
  const year = parseInt(value.slice(0, 4)),
    month = parseInt(value.slice(4, 6)),
    day = parseInt(value.slice(6, 8));
  return new Date(year, month, day);
}
