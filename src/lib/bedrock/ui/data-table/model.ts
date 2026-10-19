import {
	columnFilteringFeature,
	columnGroupingFeature,
	columnOrderingFeature,
	columnVisibilityFeature,
	createExpandedRowModel,
	createFilteredRowModel,
	createGroupedRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_includesString,
	globalFilteringFeature,
	rowExpandingFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	tableFeatures
} from '@tanstack/svelte-table';

export const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	sortFns: { alphanumeric: sortFn_alphanumeric },
	rowSelectionFeature,
	columnVisibilityFeature,
	columnFilteringFeature,
	globalFilteringFeature,
	filteredRowModel: createFilteredRowModel(),
	filterFns: { includesString: filterFn_includesString },
	columnOrderingFeature,
	columnGroupingFeature,
	groupedRowModel: createGroupedRowModel(),
	rowExpandingFeature,
	expandedRowModel: createExpandedRowModel(),
	rowPaginationFeature,
	paginatedRowModel: createPaginatedRowModel()
});
export const PAGE_SIZES = [10, 25, 50, 100];
export const ALL_VIEW_KEY = '__bedrock_all__';

export const defaultLabels = {
	all: 'All',
	views: 'Views',
	searchPlaceholder: 'Search…',
	searchAria: 'Search table',
	group: 'Group by',
	groupNone: 'None',
	columns: 'Columns',
	selected: 'selected',
	clearSelection: 'Clear selection',
	selectAll: 'Select all rows',
	selectRow: 'Select row',
	selectGroup: 'Select group',
	noResults: 'No results.',
	showAll: 'Show all',
	entries: (shown: number, total: number) => `${shown} of ${total} entries`,
	rowsPerPage: 'Rows per page',
	pageOf: (page: number, pages: number) => `Page ${page} of ${pages}`,
	firstPage: 'First page',
	previousPage: 'Previous page',
	nextPage: 'Next page',
	lastPage: 'Last page',
	reorderHint: 'Drag the column or move it with Alt+Arrow keys',
	reorderAria: (header: string) => `${header} — move with Alt+Arrow keys`
};

export type DataTableLabels = Partial<typeof defaultLabels>;
