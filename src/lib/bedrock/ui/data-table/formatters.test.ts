import { describe, expect, it } from 'vitest';
import { formatCellValue, formatCurrencyParts } from './formatters.js';

describe('DataTable formatters', () => {
	it('keeps empty and identifier values predictable', () => {
		expect(formatCellValue(null, 'id')).toBe('–');
		expect(formatCellValue('AU-1042', 'id')).toBe('AU-1042');
		expect(formatCellValue('offen', 'badge')).toBe('offen');
	});

	it('formats numbers and dates with de-AT Intl', () => {
		expect(formatCellValue(1234.5, 'number')).toBe(new Intl.NumberFormat('de-AT').format(1234.5));
		const date = new Date('2026-09-01T12:00:00.000Z');
		expect(formatCellValue(date, 'date')).toBe(
			new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' }).format(date)
		);
	});

	it('splits a currency amount from its code', () => {
		const result = formatCurrencyParts(1234.5, 'EUR');
		expect(result?.amount).toContain('1');
		expect(result?.currency).toBe('EUR');
		expect(formatCurrencyParts('', 'EUR')).toBeNull();
	});
});
