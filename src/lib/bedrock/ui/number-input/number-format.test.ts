import { describe, expect, it } from 'vitest';
import { formatNumber, parseLocaleNumber } from './number-format.js';

describe('number formatting helpers', () => {
	it('parses en-US grouping and decimals', () => {
		expect(parseLocaleNumber('1,234.5', 'en-US')).toBe(1234.5);
	});

	it('parses de-AT grouping and decimal commas', () => {
		expect(parseLocaleNumber('1.234,5', 'de-AT')).toBe(1234.5);
	});

	it('returns null for invalid input', () => {
		expect(parseLocaleNumber('12 apples', 'en-US')).toBeNull();
	});

	it('formats currency and percentages through Intl', () => {
		expect(formatNumber(12.5, 'de-AT', { style: 'currency', currency: 'EUR' })).toBe(
			new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(12.5)
		);
		expect(formatNumber(0.25, 'en-US', { style: 'percent' })).toBe('25%');
	});
});
