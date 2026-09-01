import Root from './data-table.svelte';

export { formatCellValue, formatCurrencyParts } from './formatters.js';
export type { CurrencyParts } from './formatters.js';
export type {
	DataTableColumn,
	DataTableColumnType,
	DataTableDensity,
	DataTableView
} from './types.js';

export {
	Root,
	//
	Root as DataTable
};
