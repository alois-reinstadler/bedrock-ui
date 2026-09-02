import type { PowerSearchFilter } from './types.js';

/** Normalizes a row's date cell (Date or ISO-ish string) to yyyy-mm-dd. */
function isoDay(raw: unknown): string | null {
	if (raw instanceof Date)
		return Number.isNaN(raw.getTime()) ? null : raw.toISOString().slice(0, 10);
	if (typeof raw === 'string' && raw.length >= 10) return raw.slice(0, 10);
	return null;
}

/** Whether one row cell satisfies one filter. Rows missing the field never match. */
function matches(filter: PowerSearchFilter, raw: unknown): boolean {
	if (raw === undefined || raw === null) return false;
	const { operator, value } = filter;
	switch (value.type) {
		case 'string': {
			if (typeof raw !== 'string' && typeof raw !== 'number') return false;
			const text = String(raw);
			if (operator === 'contains') return text.toLowerCase().includes(value.value.toLowerCase());
			return text === value.value; // 'is'
		}
		case 'number': {
			const numeric = typeof raw === 'number' ? raw : Number(raw);
			if (raw === '' || Number.isNaN(numeric)) return false;
			switch (operator) {
				case 'ne':
					return numeric !== value.value;
				case 'gt':
					return numeric > value.value;
				case 'lt':
					return numeric < value.value;
				case 'gte':
					return numeric >= value.value;
				case 'lte':
					return numeric <= value.value;
				default:
					return numeric === value.value; // 'eq'
			}
		}
		case 'enum': {
			const equal = String(raw) === value.value;
			return operator === 'isNot' ? !equal : equal;
		}
		case 'enumList': {
			const entries = Array.isArray(raw) ? raw.map(String) : [String(raw)];
			const any = value.value.some((candidate) => entries.includes(candidate));
			return operator === 'isNoneOf' ? !any : any;
		}
		case 'date': {
			const day = isoDay(raw);
			if (day === null) return false;
			if (operator === 'before') return day < value.value;
			if (operator === 'after') return day > value.value;
			return day === value.value; // 'is'
		}
	}
}

/**
 * Client-side application of PowerSearch filters: all filters must match (AND).
 * Free-text filters are plain string filters with the `contains` operator, so
 * they get case-insensitive contains semantics here. Date cells may hold a
 * `Date` or an ISO string; both compare against the filter's yyyy-mm-dd value.
 */
export function applyPowerSearchFilters<T extends Record<string, unknown>>(
	filters: PowerSearchFilter[],
	rows: T[]
): T[] {
	if (filters.length === 0) return rows;
	return rows.filter((row) => filters.every((filter) => matches(filter, row[filter.field])));
}
