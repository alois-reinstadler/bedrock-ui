<script lang="ts" module>
	import {
		columnFilteringFeature,
		columnGroupingFeature,
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

	const features = tableFeatures({
		rowSortingFeature,
		sortedRowModel: createSortedRowModel(),
		sortFns: { alphanumeric: sortFn_alphanumeric },
		rowSelectionFeature,
		columnVisibilityFeature,
		columnFilteringFeature,
		globalFilteringFeature,
		filteredRowModel: createFilteredRowModel(),
		filterFns: { includesString: filterFn_includesString },
		columnGroupingFeature,
		groupedRowModel: createGroupedRowModel(),
		rowExpandingFeature,
		expandedRowModel: createExpandedRowModel(),
		rowPaginationFeature,
		paginatedRowModel: createPaginatedRowModel()
	});
	const PAGE_SIZES = [10, 25, 50, 100];
	const ALL_VIEW_KEY = '__bedrock_all__';
</script>

<script lang="ts" generics="TData extends import('@tanstack/svelte-table').RowData">
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import ChevronsLeftIcon from '@lucide/svelte/icons/chevrons-left';
	import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import { createTable } from '@tanstack/svelte-table';
	import { Swap } from '#lib/bedrock/motion/index.js';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';
	import { Input } from '#lib/bedrock/ui/input';
	import * as NativeSelect from '#lib/bedrock/ui/native-select';
	import * as Table from '#lib/bedrock/ui/table';
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import { formatCellValue, formatCurrencyParts } from './formatters.js';
	import type { DataTableColumn, DataTableDensity, DataTableView } from './types.js';

	let {
		data,
		columns,
		getRowId = (row: TData, index: number) => {
			const candidate = (row as { id?: string | number }).id;
			return candidate == null ? String(index) : String(candidate);
		},
		selectable = false,
		searchable = false,
		pageSize,
		caption,
		class: className,
		actions,
		exportActions,
		views,
		groupable,
		empty,
		onRowClick
	}: {
		data: TData[];
		columns: DataTableColumn<TData>[];
		getRowId?: (row: TData, index: number) => string;
		selectable?: boolean;
		searchable?: boolean;
		pageSize?: number;
		caption?: string;
		class?: string;
		actions?: Snippet<[TData[]]>;
		exportActions?: Snippet<[TData[]]>;
		views?: DataTableView<TData>[];
		groupable?: string[];
		empty?: Snippet;
		onRowClick?: (row: TData) => void;
	} = $props();

	let activeViewKey = $state(ALL_VIEW_KEY);
	let searchTerm = $state('');
	let density = $state<DataTableDensity>('compact');
	const activeView = $derived(views?.find((view) => view.key === activeViewKey));
	const viewData = $derived(activeView ? data.filter(activeView.filter) : data);
	const viewCounts = $derived(
		new Map((views ?? []).map((view) => [view.key, data.filter(view.filter).length]))
	);
	$effect(() => {
		if (activeViewKey !== ALL_VIEW_KEY && !views?.some((view) => view.key === activeViewKey))
			activeViewKey = ALL_VIEW_KEY;
	});

	const specByKey = $derived(new Map(columns.map((column) => [column.key, column])));
	const columnDefs = $derived(
		columns.map((column) => ({
			id: column.key,
			accessorFn: column.accessor ?? ((row: TData) => (row as Record<string, unknown>)[column.key]),
			header: column.header,
			enableSorting: column.sortable ?? true,
			enableHiding: column.hideable ?? true,
			enableGrouping: groupable?.includes(column.key) ?? false
		}))
	);

	const table = createTable({
		features,
		get columns() {
			return columnDefs;
		},
		get data() {
			return viewData;
		},
		getRowId: (row: TData, index: number) => getRowId(row, index),
		get enableRowSelection() {
			return selectable;
		},
		globalFilterFn: 'includesString',
		groupedColumnMode: false,
		paginateExpandedRows: false,
		initialState: {
			expanded: true,
			pagination: {
				pageIndex: 0,
				get pageSize() {
					return pageSize ?? Number.MAX_SAFE_INTEGER;
				}
			}
		}
	});
	$effect(() => table.setGlobalFilter(searchTerm.trim()));

	const selectedRows = $derived(
		selectable ? table.getSelectedRowModel().rows.map((row) => row.original) : []
	);
	const filteredRows = $derived(table.getFilteredRowModel().rows.map((row) => row.original));
	const visibleColumns = $derived(table.getVisibleLeafColumns());
	const columnCount = $derived(visibleColumns.length + (selectable ? 1 : 0));
	const pagination = $derived(table.atoms.pagination.get());
	const grouping = $derived(table.atoms.grouping.get());
	const hideableColumns = $derived(
		table.getAllLeafColumns().filter((column) => column.getCanHide())
	);

	function selectView(key: string) {
		activeViewKey = key;
		table.setPageIndex(0);
	}
	function setGrouping(key: string) {
		table.setGrouping(key ? [key] : []);
		table.setExpanded(true);
		table.setPageIndex(0);
	}
	function leafCount(rows: ReturnType<typeof table.getRowModel>['rows']): number {
		return rows.reduce(
			(count, row) => count + (row.subRows.length ? leafCount(row.subRows) : 1),
			0
		);
	}
	function alignmentClass(key: string): string {
		const spec = specByKey.get(key);
		const align =
			spec?.align ?? (spec?.type === 'number' || spec?.type === 'currency' ? 'end' : 'start');
		return align === 'end' ? 'text-right' : 'text-left';
	}
</script>

<div data-slot="data-table" class={cn('flex w-full flex-col gap-3', className)}>
	{#if views?.length}
		<div
			class="flex items-center gap-1 border-b border-border"
			role="tablist"
			aria-label="Ansichten"
		>
			<button
				type="button"
				role="tab"
				aria-selected={activeViewKey === ALL_VIEW_KEY}
				class={cn(
					'relative min-h-11 px-3 text-sm font-medium after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
					activeViewKey === ALL_VIEW_KEY
						? 'text-foreground after:opacity-100'
						: 'text-muted-foreground after:opacity-0'
				)}
				onclick={() => selectView(ALL_VIEW_KEY)}
			>
				Alle <span class="ml-1 tabular-nums">{data.length}</span>
			</button>
			{#each views as view (view.key)}
				{@const count = viewCounts.get(view.key) ?? 0}
				<button
					type="button"
					role="tab"
					aria-selected={activeViewKey === view.key}
					class={cn(
						'relative min-h-11 px-3 text-sm font-medium after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
						activeViewKey === view.key
							? 'text-foreground after:opacity-100'
							: 'text-muted-foreground after:opacity-0',
						count === 0 && 'opacity-50'
					)}
					onclick={() => selectView(view.key)}
				>
					{view.label} <span class="ml-1 tabular-nums">{count}</span>
				</button>
			{/each}
		</div>
	{/if}

	{#if searchable || groupable?.length || (selectable && actions) || hideableColumns.length || exportActions}
		<div class="flex flex-wrap items-center gap-2">
			{#if searchable}<Input
					type="search"
					placeholder="Suchen…"
					aria-label="Tabelle durchsuchen"
					class="h-8 w-56"
					value={searchTerm}
					oninput={(event: Event & { currentTarget: HTMLInputElement }) =>
						(searchTerm = event.currentTarget.value)}
				/>{/if}
			{#if groupable?.length}
				<label class="flex items-center gap-2 text-sm text-muted-foreground"
					>Gruppieren
					<NativeSelect.Root
						class="h-8 min-w-36"
						value={grouping[0] ?? ''}
						onchange={(event) => setGrouping(event.currentTarget.value)}
					>
						<NativeSelect.Option value="">Keine</NativeSelect.Option>
						{#each groupable as key (key)}{#if specByKey.has(key)}<NativeSelect.Option value={key}
									>{specByKey.get(key)?.header}</NativeSelect.Option
								>{/if}{/each}
					</NativeSelect.Root>
				</label>
			{/if}
			{#if selectable && selectedRows.length > 0 && actions}
				<div
					class="flex items-center gap-2 rounded-lg border border-border bg-muted/50 py-1 pr-1 pl-3"
				>
					<span class="flex items-center gap-1 text-sm text-muted-foreground tabular-nums"
						><Swap key={selectedRows.length}>{selectedRows.length}</Swap> ausgewählt</span
					>{@render actions(selectedRows)}
				</div>
			{/if}
			<div class="ml-auto flex items-center gap-2">
				<div class="flex rounded-lg border border-border p-0.5" aria-label="Tabellendichte">
					<Button
						variant={density === 'compact' ? 'secondary' : 'ghost'}
						size="sm"
						aria-pressed={density === 'compact'}
						onclick={() => (density = 'compact')}>Kompakt</Button
					>
					<Button
						variant={density === 'comfortable' ? 'secondary' : 'ghost'}
						size="sm"
						aria-pressed={density === 'comfortable'}
						onclick={() => (density = 'comfortable')}>Komfortabel</Button
					>
				</div>
				{#if hideableColumns.length > 0}
					<DropdownMenu.Root
						><DropdownMenu.Trigger
							>{#snippet child({ props })}<Button {...props} variant="outline" size="sm"
									><Settings2Icon />Spalten</Button
								>{/snippet}</DropdownMenu.Trigger
						>
						<DropdownMenu.Content align="end"
							>{#each hideableColumns as column (column.id)}<DropdownMenu.CheckboxItem
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
									>{specByKey.get(column.id)?.header ?? column.id}</DropdownMenu.CheckboxItem
								>{/each}</DropdownMenu.Content
						>
					</DropdownMenu.Root>
				{/if}
				{@render exportActions?.(filteredRows)}
			</div>
		</div>
	{/if}

	<div class="overflow-x-auto rounded-lg border border-border">
		<Table.Root>
			{#if caption}<Table.Caption class="sr-only">{caption}</Table.Caption>{/if}
			<Table.Header
				><Table.Row class={density === 'compact' ? 'h-8' : 'h-10'}>
					{#if selectable}<Table.Head class="w-10"
							><Checkbox
								checked={table.getIsAllRowsSelected()}
								indeterminate={table.getIsSomeRowsSelected()}
								aria-label="Alle Zeilen auswählen"
								onCheckedChange={() => table.toggleAllRowsSelected()}
							/></Table.Head
						>{/if}
					{#each visibleColumns as column (column.id)}
						{@const sorted = column.getIsSorted()}
						<Table.Head
							class={cn(alignmentClass(column.id), specByKey.get(column.id)?.class)}
							aria-sort={sorted === 'asc'
								? 'ascending'
								: sorted === 'desc'
									? 'descending'
									: undefined}
						>
							{#if column.getCanSort()}<button
									type="button"
									class={cn(
										'tap-target inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
										sorted ? 'text-foreground' : 'text-muted-foreground'
									)}
									onclick={() => column.toggleSorting()}
									>{specByKey.get(column.id)?.header ?? column.id}{#if sorted === 'asc'}<ArrowUpIcon
											class="size-3.5"
										/>{:else if sorted === 'desc'}<ArrowDownIcon
											class="size-3.5"
										/>{:else}<ChevronsUpDownIcon class="size-3.5 opacity-50" />{/if}</button
								>{:else}{specByKey.get(column.id)?.header ?? column.id}{/if}
						</Table.Head>
					{/each}
				</Table.Row></Table.Header
			>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					{#if row.getIsGrouped()}
						<Table.Row class={cn('bg-muted/40', density === 'compact' ? 'h-8' : 'h-10')}
							><Table.Cell colspan={columnCount}>
								<button
									type="button"
									class="tap-target flex min-h-7 items-center gap-2 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
									aria-expanded={row.getIsExpanded()}
									onclick={() => row.toggleExpanded()}
									>{#if row.getIsExpanded()}<ChevronUpIcon class="size-4" />{:else}<ChevronDownIcon
											class="size-4"
										/>{/if}<span>{String(row.groupingValue ?? '–')}</span><span
										class="text-xs font-normal text-muted-foreground tabular-nums"
										>{leafCount(row.subRows)}</span
									></button
								>
							</Table.Cell></Table.Row
						>
					{:else}
						<Table.Row
							data-state={row.getIsSelected() ? 'selected' : undefined}
							class={cn(density === 'compact' ? 'h-8' : 'h-10', onRowClick && 'cursor-pointer')}
							onclick={onRowClick ? () => onRowClick(row.original) : undefined}
						>
							{#if selectable}<Table.Cell
									class="w-10"
									onclick={(event: MouseEvent) => event.stopPropagation()}
									><Checkbox
										checked={row.getIsSelected()}
										disabled={!row.getCanSelect()}
										aria-label="Zeile auswählen"
										onCheckedChange={() => row.toggleSelected()}
									/></Table.Cell
								>{/if}
							{#each visibleColumns as column (column.id)}
								{@const spec = specByKey.get(column.id)}{@const value = row.getValue(column.id)}
								<Table.Cell
									class={cn(
										alignmentClass(column.id),
										row.depth > 0 && column.id === visibleColumns[0]?.id && 'pl-8',
										spec?.type === 'id' && 'font-mono text-xs',
										spec?.class
									)}
								>
									{#if spec?.cell}{@render spec.cell(
											row.original,
											value
										)}{:else if spec?.type === 'badge'}<Badge
											variant={spec.badgeVariant?.(value, row.original)}
											>{formatCellValue(value, 'badge')}</Badge
										>{:else if spec?.type === 'currency'}{@const currency = formatCurrencyParts(
											value,
											spec.currency
										)}{#if currency}<span class="tabular-nums">{currency.amount}</span>
											<span class="ml-1 text-xs text-muted-foreground">{currency.currency}</span
											>{:else}–{/if}{:else}{formatCellValue(value, spec?.type, spec?.currency)}{/if}
								</Table.Cell>
							{/each}
						</Table.Row>
					{/if}
				{:else}<Table.Row
						><Table.Cell colspan={columnCount} class="h-24 text-center text-muted-foreground"
							>{#if empty}{@render empty()}{:else}Keine Ergebnisse.{/if}</Table.Cell
						></Table.Row
					>{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
		<span class="tabular-nums">{filteredRows.length} von {data.length} Einträgen</span>
		{#if selectable}<span class="flex items-center gap-1 tabular-nums"
				><Swap key={selectedRows.length}>{selectedRows.length}</Swap> von {filteredRows.length} Zeilen
				ausgewählt</span
			>{/if}
		{#if pageSize}<div class="ml-auto flex items-center gap-4">
				<label class="flex items-center gap-2"
					>Zeilen pro Seite<NativeSelect.Root
						class="h-8 w-18"
						value={String(pagination.pageSize)}
						onchange={(event) => table.setPageSize(Number(event.currentTarget.value))}
						>{#each PAGE_SIZES as size (size)}<NativeSelect.Option value={String(size)}
								>{size}</NativeSelect.Option
							>{/each}</NativeSelect.Root
					></label
				><span class="tabular-nums"
					>Seite {pagination.pageIndex + 1} von {Math.max(table.getPageCount(), 1)}</span
				>
				<div class="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon-sm"
						aria-label="Erste Seite"
						disabled={!table.getCanPreviousPage()}
						onclick={() => table.firstPage()}><ChevronsLeftIcon /></Button
					><Button
						variant="outline"
						size="icon-sm"
						aria-label="Vorherige Seite"
						disabled={!table.getCanPreviousPage()}
						onclick={() => table.previousPage()}><ChevronLeftIcon /></Button
					><Button
						variant="outline"
						size="icon-sm"
						aria-label="Nächste Seite"
						disabled={!table.getCanNextPage()}
						onclick={() => table.nextPage()}><ChevronRightIcon /></Button
					><Button
						variant="outline"
						size="icon-sm"
						aria-label="Letzte Seite"
						disabled={!table.getCanNextPage()}
						onclick={() => table.lastPage()}><ChevronsRightIcon /></Button
					>
				</div>
			</div>{/if}
	</div>
</div>
