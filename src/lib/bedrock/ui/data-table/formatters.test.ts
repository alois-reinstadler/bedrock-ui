import { describe, expect, it } from 'vitest';
import { formatCellValue, formatCurrencyParts } from './formatters.js';

describe('DataTable formatters', () => {
	it('keeps empty and identifier values predictable', () => {
		expect(formatCellValue(null, 'id')).toBe('–');
		expect(formatCellValue('AU-1042', 'id')).toBe('AU-1042');
		expect(formatCellValue('offen', 'badge')).toBe('offen');
	});

	it('formats numbers and dates with en-US Intl by default', () => {
		expect(formatCellValue(1234.5, 'number')).toBe(new Intl.NumberFormat('en-US').format(1234.5));
		const date = new Date('2026-09-01T12:00:00.000Z');
		expect(formatCellValue(date, 'date')).toBe(
			new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
		);
	});

	it('supports Austrian German as an explicit locale override', () => {
		const date = new Date('2026-09-01T12:00:00.000Z');
		expect(formatCellValue(1234.5, 'number', undefined, 'de-AT')).toBe(
			new Intl.NumberFormat('de-AT').format(1234.5)
		);
		expect(formatCellValue(date, 'date', undefined, 'de-AT')).toBe(
			new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' }).format(date)
		);
		const expectedAmount = new Intl.NumberFormat('de-AT', {
			style: 'currency',
			currency: 'EUR'
		})
			.formatToParts(1234.5)
			.filter((part) => part.type !== 'currency' && part.type !== 'literal')
			.map((part) => part.value)
			.join('');
		expect(formatCurrencyParts(1234.5, 'EUR', 'de-AT')?.amount).toBe(expectedAmount);
	});

	it('splits a currency amount from its code', () => {
		const result = formatCurrencyParts(1234.5, 'EUR');
		expect(result?.amount).toContain('1');
		expect(result?.currency).toBe('EUR');
		expect(formatCurrencyParts('', 'EUR')).toBeNull();
	});
});
