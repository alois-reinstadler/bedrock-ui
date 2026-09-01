<script lang="ts" module>
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
		columnOrderingFeature,
		columnGroupingFeature,
		groupedRowModel: createGroupedRowModel(),
		rowExpandingFeature,
		expandedRowModel: createExpandedRowModel(),
		rowPaginationFeature,
		paginatedRowModel: createPaginatedRowModel()
	});
	const PAGE_SIZES = [10, 25, 50, 100];
	const ALL_VIEW_KEY = '__bedrock_all__';

	const defaultLabels = {
		all: 'Alle',
		views: 'Ansichten',
		searchPlaceholder: 'Suchen…',
		searchAria: 'Tabelle durchsuchen',
		group: 'Gruppieren',
		groupNone: 'Keine',
		columns: 'Spalten',
		selected: 'ausgewählt',
		clearSelection: 'Auswahl aufheben',
		selectAll: 'Alle Zeilen auswählen',
		selectRow: 'Zeile auswählen',
		selectGroup: 'Gruppe auswählen',
		noResults: 'Keine Ergebnisse.',
		showAll: 'Alle anzeigen',
		entries: (shown: number, total: number) => `${shown} von ${total} Einträgen`,
		rowsPerPage: 'Zeilen pro Seite',
		pageOf: (page: number, pages: number) => `Seite ${page} von ${pages}`,
		firstPage: 'Erste Seite',
		previousPage: 'Vorherige Seite',
		nextPage: 'Nächste Seite',
		lastPage: 'Letzte Seite',
		reorderHint: 'Spalte ziehen oder mit Alt+Pfeiltasten verschieben',
		reorderAria: (header: string) => `${header} — mit Alt+Pfeiltasten verschieben`
	};

	export type DataTableLabels = Partial<typeof defaultLabels>;
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
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import XIcon from '@lucide/svelte/icons/x';
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
	import type { DataTableColumn, DataTableView } from './types.js';

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
		reorderable = false,
		columnOrder = $bindable(),
		labels: labelOverrides = {},
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
		/** Lets the user rearrange columns by dragging headers or Alt+arrow keys. */
		reorderable?: boolean;
		/** Current column order (ids); bindable so apps can persist the layout. */
		columnOrder?: string[];
		/** Overrides for the built-in (German) UI strings. */
		labels?: DataTableLabels;
		empty?: Snippet;
		onRowClick?: (row: TData) => void;
	} = $props();

	const uid = $props.id();
	const l = $derived({ ...defaultLabels, ...labelOverrides });

	let activeViewKey = $state(ALL_VIEW_KEY);
	let searchTerm = $state('');
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
	const isGrouped = $derived(grouping.length > 0);

	function setGrouping(key: string) {
		table.setGrouping(key ? [key] : []);
		table.setExpanded(true);
		table.setPageIndex(0);
		// Pagination over group rows miscounts entries, so grouped tables
		// show everything and the pagination controls hide.
		table.setPageSize(key ? Number.MAX_SAFE_INTEGER : (pageSize ?? Number.MAX_SAFE_INTEGER));
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

	let draggedColumn = $state<string | null>(null);
	let dropTarget = $state<{ id: string; after: boolean } | null>(null);

	function applyColumnOrder(next: string[]) {
		table.setColumnOrder(next);
		columnOrder = next;
	}

	function moveColumn(activeId: string, overId: string, after: boolean) {
		if (activeId === overId) return;
		const next = table
			.getAllLeafColumns()
			.map((column) => column.id)
			.filter((id) => id !== activeId);
		next.splice(next.indexOf(overId) + (after ? 1 : 0), 0, activeId);
		applyColumnOrder(next);
	}

	function moveColumnBy(id: string, delta: number) {
		const ids = table.getAllLeafColumns().map((column) => column.id);
		const from = ids.indexOf(id);
		const to = from + delta;
		if (from === -1 || to < 0 || to >= ids.length) return;
		const next = ids.filter((candidate) => candidate !== id);
		next.splice(to, 0, id);
		applyColumnOrder(next);
	}

	$effect(() => {
		// External writes to the bindable prop reapply; internal writes match.
		if (!columnOrder) return;
		const current = table.getAllLeafColumns().map((column) => column.id);
		if (columnOrder.join('\u0000') !== current.join('\u0000'))
			table.setColumnOrder([...columnOrder]);
	});

	function onHeaderDragStart(event: DragEvent, id: string) {
		if (!reorderable) return;
		draggedColumn = id;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', id);
		}
	}

	function onHeaderDragOver(event: DragEvent, id: string) {
		if (!reorderable || !draggedColumn || draggedColumn === id) return;
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
		const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
		dropTarget = { id, after: event.clientX > bounds.left + bounds.width / 2 };
	}

	function onHeaderDrop(event: DragEvent, id: string) {
		if (!reorderable || !draggedColumn) return;
		event.preventDefault();
		moveColumn(draggedColumn, id, dropTarget?.id === id ? dropTarget.after : false);
		draggedColumn = null;
		dropTarget = null;
	}

	function onHeaderDragEnd() {
		draggedColumn = null;
		dropTarget = null;
	}

	function onTabKeydown(event: KeyboardEvent, position: number) {
		const keys = [ALL_VIEW_KEY, ...(views ?? []).map((view) => view.key)];
		let target: number;
		if (event.key === 'ArrowRight') target = (position + 1) % keys.length;
		else if (event.key === 'ArrowLeft') target = (position - 1 + keys.length) % keys.length;
		else if (event.key === 'Home') target = 0;
		else if (event.key === 'End') target = keys.length - 1;
		else return;
		event.preventDefault();
		selectView(keys[target]);
		const tablist = (event.currentTarget as HTMLElement).closest('[role="tablist"]');
		(tablist?.querySelectorAll<HTMLElement>('[role="tab"]')[target] as HTMLElement)?.focus();
	}

	function onHeaderKeydown(event: KeyboardEvent, id: string) {
		if (!reorderable || !event.altKey) return;
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			moveColumnBy(id, -1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			moveColumnBy(id, 1);
		}
	}

	function reorderClasses(id: string): string | false {
		if (!reorderable) return false;
		return cn(
			'cursor-grab select-none',
			draggedColumn === id && 'opacity-50',
			dropTarget?.id === id &&
				(dropTarget.after
					? 'shadow-[inset_-2px_0_0_var(--color-primary)]'
					: 'shadow-[inset_2px_0_0_var(--color-primary)]')
		);
	}
</script>

<div data-slot="data-table" class={cn('flex w-full flex-col gap-3', className)}>
	{#if views?.length}
		<div
			class="flex items-center gap-1 overflow-x-auto border-b border-border"
			role="tablist"
			aria-label={l.views}
		>
			<button
				type="button"
				role="tab"
				aria-selected={activeViewKey === ALL_VIEW_KEY}
				tabindex={activeViewKey === ALL_VIEW_KEY ? 0 : -1}
				class={cn(
					'relative min-h-11 shrink-0 px-3 text-sm font-medium after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
					activeViewKey === ALL_VIEW_KEY
						? 'text-foreground after:opacity-100'
						: 'text-muted-foreground after:opacity-0'
				)}
				onclick={() => selectView(ALL_VIEW_KEY)}
				onkeydown={(event: KeyboardEvent) => onTabKeydown(event, 0)}
			>
				{l.all} <span class="ml-1 tabular-nums">{data.length}</span>
			</button>
			{#each views as view, viewIndex (view.key)}
				{@const count = viewCounts.get(view.key) ?? 0}
				<button
					type="button"
					role="tab"
					aria-selected={activeViewKey === view.key}
					tabindex={activeViewKey === view.key ? 0 : -1}
					class={cn(
						'relative min-h-11 shrink-0 px-3 text-sm font-medium after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
						activeViewKey === view.key
							? 'text-foreground after:opacity-100'
							: 'text-muted-foreground after:opacity-0',
						count === 0 && 'opacity-50'
					)}
					onclick={() => selectView(view.key)}
					onkeydown={(event: KeyboardEvent) => onTabKeydown(event, viewIndex + 1)}
				>
					{view.label} <span class="ml-1 tabular-nums">{count}</span>
				</button>
			{/each}
		</div>
	{/if}

	{#if searchable || groupable?.length || hideableColumns.length || exportActions}
		<div class="flex flex-wrap items-center gap-2">
			{#if searchable}<Input
					type="search"
					id="{uid}-search"
					name="search"
					placeholder={l.searchPlaceholder}
					aria-label={l.searchAria}
					class="h-8 w-56"
					value={searchTerm}
					oninput={(event: Event & { currentTarget: HTMLInputElement }) =>
						(searchTerm = event.currentTarget.value)}
				/>{/if}
			{#if groupable?.length}
				<label class="flex items-center gap-2 text-sm text-muted-foreground" for="{uid}-group"
					>{l.group}
					<NativeSelect.Root
						id="{uid}-group"
						name="group"
						class="h-8 min-w-36"
						value={grouping[0] ?? ''}
						onchange={(event) => setGrouping(event.currentTarget.value)}
					>
						<NativeSelect.Option value="">{l.groupNone}</NativeSelect.Option>
						{#each groupable as key (key)}{#if specByKey.has(key)}<NativeSelect.Option value={key}
									>{specByKey.get(key)?.header}</NativeSelect.Option
								>{/if}{/each}
					</NativeSelect.Root>
				</label>
			{/if}
			<div class="ml-auto flex items-center gap-2">
				{#if hideableColumns.length > 0}
					<DropdownMenu.Root
						><DropdownMenu.Trigger
							>{#snippet child({ props })}<Button {...props} variant="outline" size="sm"
									><Settings2Icon />{l.columns}</Button
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
				><Table.Row class="h-8">
					{#if selectable}<Table.Head class="w-10"
							><Checkbox
								name="{uid}-select-all"
								checked={table.getIsAllRowsSelected()}
								indeterminate={table.getIsSomeRowsSelected()}
								aria-label={l.selectAll}
								onCheckedChange={() => table.toggleAllRowsSelected()}
							/></Table.Head
						>{/if}
					{#each visibleColumns as column (column.id)}
						{@const sorted = column.getIsSorted()}
						<Table.Head
							class={cn(
								alignmentClass(column.id),
								reorderClasses(column.id),
								specByKey.get(column.id)?.class
							)}
							aria-sort={sorted === 'asc'
								? 'ascending'
								: sorted === 'desc'
									? 'descending'
									: undefined}
							draggable={reorderable ? 'true' : undefined}
							title={reorderable ? l.reorderHint : undefined}
							ondragstart={(event: DragEvent) => onHeaderDragStart(event, column.id)}
							ondragover={(event: DragEvent) => onHeaderDragOver(event, column.id)}
							ondrop={(event: DragEvent) => onHeaderDrop(event, column.id)}
							ondragend={onHeaderDragEnd}
						>
							{#if column.getCanSort()}<button
									type="button"
									class={cn(
										'tap-target inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
										sorted ? 'text-foreground' : 'text-muted-foreground'
									)}
									aria-keyshortcuts={reorderable ? 'Alt+ArrowLeft Alt+ArrowRight' : undefined}
									onkeydown={(event: KeyboardEvent) => onHeaderKeydown(event, column.id)}
									onclick={() => column.toggleSorting()}
									>{#if reorderable}<GripVerticalIcon
											class="size-3 shrink-0 opacity-40"
										/>{/if}{specByKey.get(column.id)?.header ??
										column.id}{#if sorted === 'asc'}<ArrowUpIcon
											class="size-3.5"
										/>{:else if sorted === 'desc'}<ArrowDownIcon
											class="size-3.5"
										/>{:else}<ChevronsUpDownIcon class="size-3.5 opacity-50" />{/if}</button
								>{:else if reorderable}<span
									role="button"
									tabindex="0"
									class="inline-flex h-7 items-center gap-1 rounded-md px-1.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
									aria-label={l.reorderAria(specByKey.get(column.id)?.header ?? column.id)}
									aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight"
									onkeydown={(event: KeyboardEvent) => onHeaderKeydown(event, column.id)}
									><GripVerticalIcon class="size-3 shrink-0 opacity-40" />{specByKey.get(column.id)
										?.header ?? column.id}</span
								>{:else}{specByKey.get(column.id)?.header ?? column.id}{/if}
						</Table.Head>
					{/each}
				</Table.Row></Table.Header
			>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					{#if row.getIsGrouped()}
						<Table.Row class="h-8 bg-muted/40">
							{#if selectable}<Table.Cell class="w-10"
									><Checkbox
										name="{uid}-select-group"
										checked={row.getIsAllSubRowsSelected()}
										indeterminate={row.getIsSomeSelected()}
										aria-label="{l.selectGroup}: {String(row.groupingValue ?? '–')}"
										onCheckedChange={() => row.toggleSelected()}
									/></Table.Cell
								>{/if}
							<Table.Cell colspan={columnCount - (selectable ? 1 : 0)}>
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
							class={cn('h-8', onRowClick && 'cursor-pointer')}
							onclick={onRowClick ? () => onRowClick(row.original) : undefined}
						>
							{#if selectable}<Table.Cell
									class="w-10"
									onclick={(event: MouseEvent) => event.stopPropagation()}
									><Checkbox
										name="{uid}-select-row"
										checked={row.getIsSelected()}
										disabled={!row.getCanSelect()}
										aria-label={l.selectRow}
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
							>{#if empty}{@render empty()}{:else}<span
									class="inline-flex flex-col items-center gap-2"
									>{l.noResults}{#if activeView}<Button
											variant="outline"
											size="sm"
											onclick={() => selectView(ALL_VIEW_KEY)}>{l.showAll} ({data.length})</Button
										>{/if}</span
								>{/if}</Table.Cell
						></Table.Row
					>{/each}
			</Table.Body>
		</Table.Root>
	</div>

	{#if selectable && selectedRows.length > 0}
		<div
			data-slot="data-table-selection-bar"
			role="status"
			class="bedrock-selection-bar sticky bottom-4 z-10 mx-auto flex items-center gap-2 rounded-full border border-border bg-background/95 py-1.5 pr-1.5 pl-4 shadow-lg supports-backdrop-filter:backdrop-blur-sm"
		>
			<span class="flex items-center gap-1 text-sm font-medium tabular-nums">
				<Swap key={selectedRows.length}>{selectedRows.length}</Swap>
				{l.selected}
			</span>
			{@render actions?.(selectedRows)}
			<button
				type="button"
				aria-label={l.clearSelection}
				class="tap-target inline-flex size-7 items-center justify-center rounded-full text-muted-foreground motion-state hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				onclick={() => table.resetRowSelection()}
			>
				<XIcon class="size-4" />
			</button>
		</div>
	{/if}

	<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
		<span class="tabular-nums">{l.entries(filteredRows.length, data.length)}</span>
		{#if pageSize && !isGrouped}<div class="ml-auto flex items-center gap-4">
				<label class="flex items-center gap-2" for="{uid}-page-size"
					>{l.rowsPerPage}<NativeSelect.Root
						id="{uid}-page-size"
						name="page-size"
						class="h-8 w-18"
						value={String(pagination.pageSize)}
						onchange={(event) => table.setPageSize(Number(event.currentTarget.value))}
						>{#each PAGE_SIZES as size (size)}<NativeSelect.Option value={String(size)}
								>{size}</NativeSelect.Option
							>{/each}</NativeSelect.Root
					></label
				><span class="tabular-nums"
					>{l.pageOf(pagination.pageIndex + 1, Math.max(table.getPageCount(), 1))}</span
				>
				<div class="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon-sm"
						aria-label={l.firstPage}
						disabled={!table.getCanPreviousPage()}
						onclick={() => table.firstPage()}><ChevronsLeftIcon /></Button
					><Button
						variant="outline"
						size="icon-sm"
						aria-label={l.previousPage}
						disabled={!table.getCanPreviousPage()}
						onclick={() => table.previousPage()}><ChevronLeftIcon /></Button
					><Button
						variant="outline"
						size="icon-sm"
						aria-label={l.nextPage}
						disabled={!table.getCanNextPage()}
						onclick={() => table.nextPage()}><ChevronRightIcon /></Button
					><Button
						variant="outline"
						size="icon-sm"
						aria-label={l.lastPage}
						disabled={!table.getCanNextPage()}
						onclick={() => table.lastPage()}><ChevronsRightIcon /></Button
					>
				</div>
			</div>{/if}
	</div>
</div>

<style>
	.bedrock-selection-bar {
		transition:
			translate var(--motion-enter) var(--motion-ease-enter),
			opacity var(--motion-enter) var(--motion-ease-enter);
	}

	@starting-style {
		.bedrock-selection-bar {
			translate: 0 0.5rem;
			opacity: 0;
		}
	}
</style>
