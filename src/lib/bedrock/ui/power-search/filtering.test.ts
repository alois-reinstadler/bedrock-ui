import { describe, expect, it } from 'vitest';
import { applyPowerSearchFilters } from './filtering.js';
import type { PowerSearchFilter } from './types.js';

type Order = {
	id: string;
	customer: string;
	status: string;
	total: number;
	tags: string[];
	placed: Date | string;
};

const orders: Order[] = [
	{
		id: 'A-1',
		customer: 'Alpine Trading',
		status: 'open',
		total: 120,
		tags: ['rush'],
		placed: '2026-01-10'
	},
	{
		id: 'A-2',
		customer: 'Borealis GmbH',
		status: 'paid',
		total: 80,
		tags: ['export', 'b2b'],
		placed: new Date('2026-02-05T09:30:00Z')
	},
	{
		id: 'B-1',
		customer: 'Cirrus Ltd',
		status: 'open',
		total: 200,
		tags: [],
		placed: '2026-03-01'
	}
];

const ids = (rows: Order[]) => rows.map((row) => row.id);

function stringFilter(operator: string, value: string, field = 'customer'): PowerSearchFilter {
	return { field, operator, value: { type: 'string', value } };
}

function numberFilter(operator: string, value: number): PowerSearchFilter {
	return { field: 'total', operator, value: { type: 'number', value } };
}

function enumFilter(operator: string, value: string): PowerSearchFilter {
	return { field: 'status', operator, value: { type: 'enum', value } };
}

function enumListFilter(operator: string, value: string[]): PowerSearchFilter {
	return { field: 'tags', operator, value: { type: 'enumList', value } };
}

function dateFilter(operator: string, value: string): PowerSearchFilter {
	return { field: 'placed', operator, value: { type: 'date', value } };
}

describe('applyPowerSearchFilters', () => {
	it('returns all rows for an empty filter list', () => {
		expect(applyPowerSearchFilters([], orders)).toEqual(orders);
	});

	it('applies string is exactly and contains case-insensitively', () => {
		expect(ids(applyPowerSearchFilters([stringFilter('is', 'Cirrus Ltd')], orders))).toEqual([
			'B-1'
		]);
		expect(ids(applyPowerSearchFilters([stringFilter('is', 'cirrus ltd')], orders))).toEqual([]);
		expect(ids(applyPowerSearchFilters([stringFilter('contains', 'ALPINE')], orders))).toEqual([
			'A-1'
		]);
	});

	it('treats free-text filters as case-insensitive contains on the configured field', () => {
		expect(ids(applyPowerSearchFilters([stringFilter('contains', 'RUS')], orders))).toEqual([
			'B-1'
		]);
	});

	it('applies every number operator', () => {
		expect(ids(applyPowerSearchFilters([numberFilter('eq', 120)], orders))).toEqual(['A-1']);
		expect(ids(applyPowerSearchFilters([numberFilter('ne', 120)], orders))).toEqual(['A-2', 'B-1']);
		expect(ids(applyPowerSearchFilters([numberFilter('gt', 120)], orders))).toEqual(['B-1']);
		expect(ids(applyPowerSearchFilters([numberFilter('lt', 120)], orders))).toEqual(['A-2']);
		expect(ids(applyPowerSearchFilters([numberFilter('gte', 120)], orders))).toEqual([
			'A-1',
			'B-1'
		]);
		expect(ids(applyPowerSearchFilters([numberFilter('lte', 120)], orders))).toEqual([
			'A-1',
			'A-2'
		]);
	});

	it('applies enum is and isNot', () => {
		expect(ids(applyPowerSearchFilters([enumFilter('is', 'open')], orders))).toEqual([
			'A-1',
			'B-1'
		]);
		expect(ids(applyPowerSearchFilters([enumFilter('isNot', 'open')], orders))).toEqual(['A-2']);
	});

	it('applies enumList isAnyOf and isNoneOf', () => {
		expect(
			ids(applyPowerSearchFilters([enumListFilter('isAnyOf', ['rush', 'b2b'])], orders))
		).toEqual(['A-1', 'A-2']);
		expect(
			ids(applyPowerSearchFilters([enumListFilter('isNoneOf', ['rush', 'b2b'])], orders))
		).toEqual(['B-1']);
	});

	it('compares dates for Date and ISO-string cells alike', () => {
		expect(ids(applyPowerSearchFilters([dateFilter('is', '2026-02-05')], orders))).toEqual(['A-2']);
		expect(ids(applyPowerSearchFilters([dateFilter('before', '2026-02-05')], orders))).toEqual([
			'A-1'
		]);
		expect(ids(applyPowerSearchFilters([dateFilter('after', '2026-02-05')], orders))).toEqual([
			'B-1'
		]);
	});

	it('combines multiple filters with AND', () => {
		expect(
			ids(applyPowerSearchFilters([enumFilter('is', 'open'), numberFilter('gt', 150)], orders))
		).toEqual(['B-1']);
		expect(
			ids(applyPowerSearchFilters([enumFilter('is', 'paid'), numberFilter('gt', 150)], orders))
		).toEqual([]);
	});

	it('never matches rows that lack the filtered field', () => {
		expect(
			ids(applyPowerSearchFilters([stringFilter('contains', 'a', 'missing')], orders))
		).toEqual([]);
	});
});
