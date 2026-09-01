import type { Snippet } from 'svelte';
import type { DataTableColumnType } from './formatters.js';

export type { DataTableColumnType };

export type DataTableColumn<TData> = {
	/** Column id; doubles as the property accessor when `accessor` is absent. */
	key: string;
	header: string;
	/** Derive the cell value; defaults to `row[key]`. */
	accessor?: (row: TData) => unknown;
	/** Drives default formatting (`de-AT`) and end-alignment of numeric columns. */
	type?: DataTableColumnType;
	/** ISO 4217 code for `type: 'currency'`. @default 'EUR' */
	currency?: string;
	/** @default true */
	sortable?: boolean;
	/** @default true */
	hideable?: boolean;
	/** @default 'end' for number/currency, 'start' otherwise */
	align?: 'start' | 'end';
	/** Custom cell content; receives the row and the accessed value. */
	cell?: Snippet<[TData, unknown]>;
	/** Extra classes for header and body cells of this column. */
	class?: string;
};
