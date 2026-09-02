/** Field kinds a PowerSearch filter can target. */
export type PowerSearchFieldType = 'string' | 'number' | 'enum' | 'enumList' | 'date';

/** One operator choice, e.g. `{ key: 'gte', label: '≥' }`. */
export type PowerSearchOperator = { key: string; label: string };

export type PowerSearchField = {
	/** Row property this field filters on. */
	key: string;
	label: string;
	type: PowerSearchFieldType;
	/** Choices for `enum` / `enumList` fields. */
	values?: { value: string; label: string }[];
	/** Overrides the per-type default operator set; the first entry is preselected. */
	operators?: { key: string; label: string }[];
};

export type PowerSearchConfig = {
	fields: PowerSearchField[];
	/** Field key that plain text + Enter filters on (case-insensitive contains). */
	freeTextField?: string;
};

export type PowerSearchFilterValue =
	| { type: 'string'; value: string }
	| { type: 'number'; value: number }
	| { type: 'enum'; value: string }
	| { type: 'enumList'; value: string[] }
	/** ISO yyyy-mm-dd, as produced by `CalendarDate.toString()`. */
	| { type: 'date'; value: string };

export type PowerSearchFilter = {
	field: string;
	operator: string;
	value: PowerSearchFilterValue;
};

export type PowerSearchChange = { type: 'add' | 'edit' | 'remove'; index: number };

/** Default operator sets per field type; the first entry is preselected. */
export const defaultOperators: Record<PowerSearchFieldType, PowerSearchOperator[]> = {
	string: [
		{ key: 'is', label: 'is' },
		{ key: 'contains', label: 'contains' }
	],
	number: [
		{ key: 'eq', label: '=' },
		{ key: 'ne', label: '≠' },
		{ key: 'gt', label: '>' },
		{ key: 'lt', label: '<' },
		{ key: 'gte', label: '≥' },
		{ key: 'lte', label: '≤' }
	],
	enum: [
		{ key: 'is', label: 'is' },
		{ key: 'isNot', label: 'is not' }
	],
	enumList: [
		{ key: 'isAnyOf', label: 'is any of' },
		{ key: 'isNoneOf', label: 'is none of' }
	],
	date: [
		{ key: 'is', label: 'is' },
		{ key: 'before', label: 'before' },
		{ key: 'after', label: 'after' }
	]
};

/** The field's own operator set, falling back to the per-type defaults. */
export function operatorsForField(field: PowerSearchField): PowerSearchOperator[] {
	return field.operators ?? defaultOperators[field.type];
}
