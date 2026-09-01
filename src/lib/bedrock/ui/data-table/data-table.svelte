<script lang="ts" module>
	import {
		columnFilteringFeature,
		columnVisibilityFeature,
		createFilteredRowModel,
		createPaginatedRowModel,
		createSortedRowModel,
		filterFn_includesString,
		globalFilteringFeature,
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
		rowPaginationFeature,
		paginatedRowModel: createPaginatedRowModel(),
		columnVisibilityFeature,
		columnFilteringFeature,
		globalFilteringFeature,
		filteredRowModel: createFilteredRowModel(),
		filterFns: { includesString: filterFn_includesString }
	});

	const PAGE_SIZES = [10, 25, 50, 100];
</script>

<script lang="ts" generics="TData extends import('@tanstack/svelte-table').RowData">
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import ChevronsLeftIcon from '@lucide/svelte/icons/chevrons-left';
	import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import { createTable } from '@tanstack/svelte-table';
	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';
	import { Input } from '#lib/bedrock/ui/input';
	import * as NativeSelect from '#lib/bedrock/ui/native-select';
	import * as Table from '#lib/bedrock/ui/table';
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import { formatCellValue } from './formatters.js';
	import type { DataTableColumn } from './types.js';

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
		empty,
		onRowClick
	}: {
		data: TData[];
		columns: DataTableColumn<TData>[];
		/** Stable row identity; defaults to `row.id`, falling back to the index. */
		getRowId?: (row: TData, index: number) => string;
		/** Adds a checkbox column, selected-count footer, and the `actions` bar. */
		selectable?: boolean;
		/** Adds a global search input above the table. */
		searchable?: boolean;
		/** Enables pagination with this page size; omit to render all rows. */
		pageSize?: number;
		/** Accessible table caption (visually hidden). */
		caption?: string;
		class?: string;
		/** Bulk-action controls shown while rows are selected; receives them. */
		actions?: Snippet<[TData[]]>;
		/** Custom empty state. */
		empty?: Snippet;
		onRowClick?: (row: TData) => void;
	} = $props();

	const specByKey = $derived(new Map(columns.map((column) => [column.key, column])));
	const columnDefs = $derived(
		columns.map((column) => ({
			id: column.key,
			accessorFn: column.accessor ?? ((row: TData) => (row as Record<string, unknown>)[column.key]),
			header: column.header,
			enableSorting: column.sortable ?? true,
			enableHiding: column.hideable ?? true
		}))
	);

	const table = createTable({
		features,
		get columns() {
			return columnDefs;
		},
		get data() {
			return data;
		},
		getRowId: (row: TData, index: number) => getRowId(row, index),
		get enableRowSelection() {
			return selectable;
		},
		globalFilterFn: 'includesString',
		initialState: {
			pagination: {
				pageIndex: 0,
				// Getter defers the read out of component init, so the intentional
				// initial-value capture doesn't trip state_referenced_locally.
				get pageSize() {
					return pageSize ?? Number.MAX_SAFE_INTEGER;
				}
			}
		}
	});

	let searchTerm = $state('');
	$effect(() => {
		table.setGlobalFilter(searchTerm.trim());
	});

	const selectedRows = $derived(
		selectable ? table.getSelectedRowModel().rows.map((row) => row.original) : []
	);
	const visibleColumns = $derived(table.getVisibleLeafColumns());
	const columnCount = $derived(visibleColumns.length + (selectable ? 1 : 0));
	const pagination = $derived(table.atoms.pagination.get());
	const hideableColumns = $derived(
		table.getAllLeafColumns().filter((column) => column.getCanHide())
	);

	function alignmentClass(key: string): string {
		const spec = specByKey.get(key);
		const align =
			spec?.align ?? (spec?.type === 'number' || spec?.type === 'currency' ? 'end' : 'start');
		return align === 'end' ? 'text-right' : 'text-left';
	}
</script>

<div data-slot="data-table" class={cn('flex w-full flex-col gap-3', className)}>
	{#if searchable || (selectable && actions) || hideableColumns.length > 0}
		<div class="flex flex-wrap items-center gap-2">
			{#if searchable}
				<Input
					type="search"
					placeholder="Suchen…"
					aria-label="Tabelle durchsuchen"
					class="h-8 w-56"
					value={searchTerm}
					oninput={(event: Event & { currentTarget: HTMLInputElement }) =>
						(searchTerm = event.currentTarget.value)}
				/>
			{/if}
			{#if selectable && selectedRows.length > 0 && actions}
				<div
					data-slot="data-table-actions"
					class="flex items-center gap-2 rounded-lg border border-border bg-muted/50 py-1 pr-1 pl-3"
				>
					<span class="text-sm text-muted-foreground tabular-nums">
						{selectedRows.length} ausgewählt
					</span>
					{@render actions(selectedRows)}
				</div>
			{/if}
			<div class="ml-auto">
				{#if hideableColumns.length > 0}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline" size="sm">
									<Settings2Icon />
									Spalten
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							{#each hideableColumns as column (column.id)}
								<DropdownMenu.CheckboxItem
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
								>
									{specByKey.get(column.id)?.header ?? column.id}
								</DropdownMenu.CheckboxItem>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
			</div>
		</div>
	{/if}

	<div class="overflow-x-auto rounded-lg border border-border">
		<Table.Root>
			{#if caption}
				<Table.Caption class="sr-only">{caption}</Table.Caption>
			{/if}
			<Table.Header>
				<Table.Row>
					{#if selectable}
						<Table.Head class="w-10">
							<Checkbox
								checked={table.getIsAllRowsSelected()}
								indeterminate={table.getIsSomeRowsSelected()}
								aria-label="Alle Zeilen auswählen"
								onCheckedChange={() => table.toggleAllRowsSelected()}
							/>
						</Table.Head>
					{/if}
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
							{#if column.getCanSort()}
								<button
									type="button"
									class={cn(
										'tap-target -mx-1.5 inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-sm font-medium hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
										sorted ? 'text-foreground' : 'text-muted-foreground'
									)}
									onclick={() => column.toggleSorting()}
								>
									{specByKey.get(column.id)?.header ?? column.id}
									{#if sorted === 'asc'}
										<ArrowUpIcon class="size-3.5" />
									{:else if sorted === 'desc'}
										<ArrowDownIcon class="size-3.5" />
									{:else}
										<ChevronsUpDownIcon class="size-3.5 opacity-50" />
									{/if}
								</button>
							{:else}
								{specByKey.get(column.id)?.header ?? column.id}
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row
						data-state={row.getIsSelected() ? 'selected' : undefined}
						class={onRowClick ? 'cursor-pointer' : undefined}
						onclick={onRowClick ? () => onRowClick(row.original) : undefined}
					>
						{#if selectable}
							<Table.Cell class="w-10" onclick={(event: MouseEvent) => event.stopPropagation()}>
								<Checkbox
									checked={row.getIsSelected()}
									disabled={!row.getCanSelect()}
									aria-label="Zeile auswählen"
									onCheckedChange={() => row.toggleSelected()}
								/>
							</Table.Cell>
						{/if}
						{#each visibleColumns as column (column.id)}
							{@const spec = specByKey.get(column.id)}
							{@const value = row.getValue(column.id)}
							<Table.Cell class={cn(alignmentClass(column.id), spec?.class)}>
								{#if spec?.cell}
									{@render spec.cell(row.original, value)}
								{:else}
									{formatCellValue(value, spec?.type, spec?.currency)}
								{/if}
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columnCount} class="h-24 text-center text-muted-foreground">
							{#if empty}
								{@render empty()}
							{:else}
								Keine Ergebnisse.
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	{#if pageSize || selectable}
		<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
			{#if selectable}
				<span class="tabular-nums">
					{selectedRows.length} von {table.getFilteredRowModel().rows.length} Zeilen ausgewählt
				</span>
			{/if}
			{#if pageSize}
				<div class="ml-auto flex items-center gap-4">
					<label class="flex items-center gap-2">
						Zeilen pro Seite
						<NativeSelect.Root
							class="h-8 w-18"
							value={String(pagination.pageSize)}
							onchange={(event) => table.setPageSize(Number(event.currentTarget.value))}
						>
							{#each PAGE_SIZES as size (size)}
								<NativeSelect.Option value={String(size)}>{size}</NativeSelect.Option>
							{/each}
						</NativeSelect.Root>
					</label>
					<span class="tabular-nums">
						Seite {pagination.pageIndex + 1} von {Math.max(table.getPageCount(), 1)}
					</span>
					<div class="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="Erste Seite"
							disabled={!table.getCanPreviousPage()}
							onclick={() => table.firstPage()}
						>
							<ChevronsLeftIcon />
						</Button>
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="Vorherige Seite"
							disabled={!table.getCanPreviousPage()}
							onclick={() => table.previousPage()}
						>
							<ChevronLeftIcon />
						</Button>
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="Nächste Seite"
							disabled={!table.getCanNextPage()}
							onclick={() => table.nextPage()}
						>
							<ChevronRightIcon />
						</Button>
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="Letzte Seite"
							disabled={!table.getCanNextPage()}
							onclick={() => table.lastPage()}
						>
							<ChevronsRightIcon />
						</Button>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
