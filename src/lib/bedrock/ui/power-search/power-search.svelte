<script lang="ts" module>
	const defaultLabels = {
		results: (count: number) => `${count} results`,
		clearAll: 'Clear filters',
		edit: (label: string) => `Edit filter ${label}`,
		remove: (label: string) => `Remove filter ${label}`,
		apply: 'Apply',
		noFields: 'No matching fields.',
		operator: 'Operator',
		searchValues: 'Search values…',
		added: (label: string) => `Added filter ${label}`,
		updated: (label: string) => `Updated filter ${label}`,
		removed: (label: string) => `Removed filter ${label}`,
		cleared: 'Filters cleared'
	};
	export type PowerSearchLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import { parseDate, type CalendarDate } from '@internationalized/date';
	import { tick } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Button } from '#lib/bedrock/ui/button';
	import * as CheckboxList from '#lib/bedrock/ui/checkbox-list';
	import * as Command from '#lib/bedrock/ui/command';
	import { DateInput } from '#lib/bedrock/ui/date-input';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { Input } from '#lib/bedrock/ui/input';
	import * as NativeSelect from '#lib/bedrock/ui/native-select';
	import { NumberInput } from '#lib/bedrock/ui/number-input';
	import * as Popover from '#lib/bedrock/ui/popover';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import FilterToken from './filter-token.svelte';
	import {
		operatorsForField,
		type PowerSearchChange,
		type PowerSearchConfig,
		type PowerSearchField,
		type PowerSearchFilter,
		type PowerSearchFilterValue
	} from './types.js';

	type Builder = { mode: 'add' | 'edit'; index?: number; field: PowerSearchField };

	let {
		ref = $bindable(null),
		config,
		filters = $bindable([]),
		onFiltersChange,
		placeholder = 'Search…',
		resultCount,
		disabled = false,
		clearable = true,
		size = 'md',
		labels: labelOverrides = {},
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		config: PowerSearchConfig;
		/** Active filters; controlled/bindable. */
		filters?: PowerSearchFilter[];
		/** Clear-all emits a single change of `{ type: 'remove', index: -1 }`. */
		onFiltersChange?: (filters: PowerSearchFilter[], change: PowerSearchChange) => void;
		placeholder?: string;
		/** Renders a muted result count at the end of the bar and announces it politely. */
		resultCount?: number;
		disabled?: boolean;
		/** Show a clear-all button while filters exist. */
		clearable?: boolean;
		size?: 'sm' | 'md';
		labels?: PowerSearchLabels;
	} = $props();

	const uid = $props.id();
	const listId = `${uid}-fields`;

	let query = $state('');
	let fieldMenuOpen = $state(false);
	let highlighted = $state(0);
	let announcement = $state('');
	let inputRef = $state<HTMLInputElement | null>(null);
	let builderRef = $state<HTMLElement | null>(null);

	let builder = $state<Builder | null>(null);
	let operatorKey = $state('');
	let stringDraft = $state('');
	let numberDraft = $state<number | null>(null);
	let enumDraft = $state('');
	let enumListDraft = $state<string[]>([]);
	let dateDraft = $state<CalendarDate | undefined>(undefined);

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const tokenSize = $derived(size === 'sm' ? 'sm' : 'md');
	const fieldMatches = $derived(
		config.fields.filter((field) => field.label.toLowerCase().includes(query.toLowerCase()))
	);
	const menuOpen = $derived(fieldMenuOpen && !disabled && builder === null);
	const activeIndex = $derived(Math.min(highlighted, Math.max(fieldMatches.length - 1, 0)));
	const activeId = $derived(
		menuOpen && fieldMatches.length > 0 ? `${uid}-field-${activeIndex}` : undefined
	);
	const builderOpen = $derived(builder !== null);
	const canApply = $derived.by(() => {
		if (!builder) return false;
		switch (builder.field.type) {
			case 'string':
				return stringDraft.trim() !== '';
			case 'number':
				return numberDraft !== null;
			case 'enum':
				return enumDraft !== '';
			case 'enumList':
				return enumListDraft.length > 0;
			case 'date':
				return dateDraft !== undefined;
		}
	});

	function fieldFor(filter: PowerSearchFilter): PowerSearchField | undefined {
		return config.fields.find((field) => field.key === filter.field);
	}

	function emit(change: PowerSearchChange) {
		onFiltersChange?.(filters, change);
	}

	function resetDrafts() {
		stringDraft = '';
		numberDraft = null;
		enumDraft = '';
		enumListDraft = [];
		dateDraft = undefined;
	}

	function openAdd(field: PowerSearchField) {
		resetDrafts();
		operatorKey = operatorsForField(field)[0]?.key ?? '';
		builder = { mode: 'add', field };
		query = '';
		fieldMenuOpen = false;
		highlighted = 0;
	}

	function openEdit(index: number) {
		const filter = filters[index];
		if (!filter) return;
		const field = fieldFor(filter) ?? {
			key: filter.field,
			label: filter.field,
			type: filter.value.type
		};
		resetDrafts();
		operatorKey = filter.operator;
		switch (filter.value.type) {
			case 'string':
				stringDraft = filter.value.value;
				break;
			case 'number':
				numberDraft = filter.value.value;
				break;
			case 'enum':
				enumDraft = filter.value.value;
				break;
			case 'enumList':
				enumListDraft = [...filter.value.value];
				break;
			case 'date':
				try {
					dateDraft = parseDate(filter.value.value);
				} catch {
					dateDraft = undefined;
				}
				break;
		}
		builder = { mode: 'edit', index, field };
		fieldMenuOpen = false;
	}

	function cancelBuilder() {
		if (builder === null) return;
		builder = null;
		tick().then(() => inputRef?.focus());
	}

	function buildValue(field: PowerSearchField): PowerSearchFilterValue | null {
		switch (field.type) {
			case 'string':
				return stringDraft.trim() === '' ? null : { type: 'string', value: stringDraft.trim() };
			case 'number':
				return numberDraft === null ? null : { type: 'number', value: numberDraft };
			case 'enum':
				return enumDraft === '' ? null : { type: 'enum', value: enumDraft };
			case 'enumList':
				return enumListDraft.length === 0 ? null : { type: 'enumList', value: [...enumListDraft] };
			case 'date':
				return dateDraft === undefined ? null : { type: 'date', value: dateDraft.toString() };
		}
	}

	/** Commits the builder draft: updates `filters` and reports the change. */
	function commitBuilder() {
		if (builder === null) return;
		const value = buildValue(builder.field);
		if (value === null) return;
		const filter: PowerSearchFilter = { field: builder.field.key, operator: operatorKey, value };
		if (builder.mode === 'edit' && builder.index !== undefined) {
			const index = builder.index;
			filters = filters.map((current, position) => (position === index ? filter : current));
			emit({ type: 'edit', index });
			announcement = labels.updated(builder.field.label);
		} else {
			filters = [...filters, filter];
			emit({ type: 'add', index: filters.length - 1 });
			announcement = labels.added(builder.field.label);
		}
		builder = null;
		query = '';
		tick().then(() => inputRef?.focus());
	}

	function removeFilter(index: number) {
		const target = filters[index];
		if (!target) return;
		filters = filters.filter((_, position) => position !== index);
		emit({ type: 'remove', index });
		announcement = labels.removed(fieldFor(target)?.label ?? target.field);
		inputRef?.focus();
	}

	function clearAll() {
		if (filters.length === 0) return;
		filters = [];
		emit({ type: 'remove', index: -1 });
		announcement = labels.cleared;
		inputRef?.focus();
	}

	function addFreeText() {
		const text = query.trim();
		if (text === '' || !config.freeTextField) return;
		filters = [
			...filters,
			{ field: config.freeTextField, operator: 'contains', value: { type: 'string', value: text } }
		];
		emit({ type: 'add', index: filters.length - 1 });
		const field = config.fields.find((candidate) => candidate.key === config.freeTextField);
		announcement = labels.added(field?.label ?? config.freeTextField);
		query = '';
		fieldMenuOpen = false;
	}

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Backspace' && query === '' && filters.length > 0) {
			removeFilter(filters.length - 1);
			return;
		}
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (menuOpen) highlighted = Math.min(activeIndex + 1, fieldMatches.length - 1);
			else fieldMenuOpen = true;
			return;
		}
		if (event.key === 'ArrowUp' && menuOpen) {
			event.preventDefault();
			highlighted = Math.max(activeIndex - 1, 0);
			return;
		}
		if (event.key === 'Enter') {
			event.preventDefault();
			if (menuOpen && fieldMatches.length > 0) openAdd(fieldMatches[activeIndex]);
			else addFreeText();
			return;
		}
		if (event.key === 'Escape' && menuOpen) {
			event.preventDefault();
			fieldMenuOpen = false;
		}
	}

	function handleFocusOut(event: FocusEvent) {
		const next = event.relatedTarget;
		if (!(next instanceof Node) || !ref?.contains(next)) fieldMenuOpen = false;
	}

	function handleBuilderKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter' || builder === null || builder.field.type === 'enum') return;
		commitBuilder();
	}

	/** Keep the builder open while interacting with nested floating layers (e.g. the date calendar). */
	function handleInteractOutside(event: PointerEvent) {
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (target.closest('[data-popover-content], [data-date-picker-content]') !== null) {
			event.preventDefault();
		}
	}

	function focusBuilder() {
		tick().then(() => {
			builderRef?.querySelector<HTMLElement>('select, input:not([type="hidden"]), button')?.focus();
		});
	}
</script>

<div
	{...restProps}
	bind:this={ref}
	data-slot="power-search"
	data-size={size}
	data-disabled={disabled ? 'true' : undefined}
	class={cn(
		'relative flex w-full flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent px-2 text-sm shadow-xs motion-state focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30',
		size === 'sm' ? 'min-h-8 py-0.5' : 'min-h-9 py-1',
		disabled && 'pointer-events-none opacity-50',
		className
	)}
	onfocusout={handleFocusOut}
	onpointerdown={(event) => {
		// Clicking the field surface focuses the input, like a plain text input.
		if (event.target === ref) {
			event.preventDefault();
			inputRef?.focus();
		}
	}}
>
	{#each filters as filter, index (index)}
		<FilterToken
			{filter}
			field={fieldFor(filter)}
			size={tokenSize}
			{disabled}
			labels={{ edit: labels.edit, remove: labels.remove }}
			onEdit={() => openEdit(index)}
			onRemove={() => removeFilter(index)}
		/>
	{/each}
	<input
		bind:this={inputRef}
		bind:value={query}
		type="text"
		role="combobox"
		aria-label={placeholder}
		aria-expanded={menuOpen}
		aria-controls={listId}
		aria-autocomplete="list"
		aria-activedescendant={activeId}
		data-slot="power-search-input"
		class="h-6 min-w-24 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
		placeholder={filters.length === 0 ? placeholder : undefined}
		{disabled}
		oninput={() => {
			fieldMenuOpen = true;
			highlighted = 0;
		}}
		onkeydown={handleInputKeydown}
	/>
	{#if clearable && filters.length > 0}
		<button
			type="button"
			data-slot="power-search-clear"
			class="tap-target inline-flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground motion-state hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
			aria-label={labels.clearAll}
			{disabled}
			onclick={clearAll}
		>
			<Icon icon="close" class="size-3.5" />
		</button>
	{/if}
	{#if resultCount !== undefined}
		<span
			data-slot="power-search-results"
			aria-live="polite"
			class="shrink-0 pl-1 text-xs text-muted-foreground"
		>
			{labels.results(resultCount)}
		</span>
	{/if}
	<span role="status" aria-live="polite" class="sr-only">{announcement}</span>
	{#if menuOpen}
		<div
			id={listId}
			role="listbox"
			data-slot="power-search-field-list"
			class="absolute top-full left-0 z-50 mt-1 max-h-64 w-full motion-popover overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
		>
			{#if fieldMatches.length === 0}
				<div class="px-2 py-1.5 text-sm text-muted-foreground">{labels.noFields}</div>
			{/if}
			{#each fieldMatches as field, index (field.key)}
				<button
					id={`${uid}-field-${index}`}
					type="button"
					role="option"
					tabindex={-1}
					aria-selected={index === activeIndex}
					data-highlighted={index === activeIndex ? 'true' : undefined}
					data-slot="power-search-field-option"
					class="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm select-none data-[highlighted=true]:bg-muted"
					onpointerdown={(event) => event.preventDefault()}
					onpointermove={() => (highlighted = index)}
					onclick={() => openAdd(field)}
				>
					<Icon icon="funnel" class="text-muted-foreground" />
					<span class="truncate">{field.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<Popover.Root open={builderOpen} onOpenChange={(next: boolean) => !next && cancelBuilder()}>
	{#if builder !== null}
		<Popover.Content
			customAnchor={ref}
			align="start"
			side="bottom"
			data-slot="power-search-builder"
			class="w-72 p-3"
			onkeydown={handleBuilderKeydown}
			onOpenAutoFocus={(event: Event) => {
				event.preventDefault();
				focusBuilder();
			}}
			onCloseAutoFocus={(event: Event) => event.preventDefault()}
			onInteractOutside={handleInteractOutside}
		>
			<div bind:this={builderRef} class="flex flex-col gap-2">
				<div data-slot="power-search-builder-title" class="text-sm font-medium">
					{builder.field.label}
				</div>
				<NativeSelect.Root
					value={operatorKey}
					onchange={(event) => (operatorKey = event.currentTarget.value)}
					size="sm"
					class="w-full"
					aria-label={labels.operator}
					data-slot="power-search-operator"
				>
					{#each operatorsForField(builder.field) as operator (operator.key)}
						<NativeSelect.Option value={operator.key}>{operator.label}</NativeSelect.Option>
					{/each}
				</NativeSelect.Root>
				{#if builder.field.type === 'string'}
					<Input
						value={stringDraft}
						oninput={(event) => (stringDraft = event.currentTarget.value)}
						type="text"
						aria-label={builder.field.label}
						data-slot="power-search-value-string"
					/>
				{:else if builder.field.type === 'number'}
					<NumberInput
						bind:value={numberDraft}
						aria-label={builder.field.label}
						data-slot="power-search-value-number"
					/>
				{:else if builder.field.type === 'enum'}
					<Command.Root class="bg-transparent" data-slot="power-search-value-enum">
						<div class={(builder.field.values?.length ?? 0) > 6 ? undefined : 'sr-only'}>
							<Command.Input placeholder={labels.searchValues} />
						</div>
						<Command.List>
							<Command.Empty>{labels.noFields}</Command.Empty>
							{#each builder.field.values ?? [] as entry (entry.value)}
								<Command.Item
									value={entry.label}
									data-checked={entry.value === enumDraft ? 'true' : undefined}
									data-slot="power-search-enum-item"
									onSelect={() => {
										enumDraft = entry.value;
										commitBuilder();
									}}
								>
									<span class="truncate">{entry.label}</span>
									{#if entry.value === enumDraft}
										<Icon icon="check" class="ml-auto text-muted-foreground" />
									{/if}
								</Command.Item>
							{/each}
						</Command.List>
					</Command.Root>
				{:else if builder.field.type === 'enumList'}
					<CheckboxList.Root
						bind:value={enumListDraft}
						label={builder.field.label}
						hideLabel
						data-slot="power-search-value-enum-list"
						class="max-h-64 overflow-y-auto"
					>
						{#each builder.field.values ?? [] as entry (entry.value)}
							<CheckboxList.Item value={entry.value} label={entry.label} class="min-h-9 py-1" />
						{/each}
					</CheckboxList.Root>
				{:else if builder.field.type === 'date'}
					<DateInput bind:value={dateDraft} data-slot="power-search-value-date" />
				{/if}
				<Button
					size="sm"
					disabled={!canApply}
					data-slot="power-search-apply"
					onclick={commitBuilder}
				>
					{labels.apply}
				</Button>
			</div>
		</Popover.Content>
	{/if}
</Popover.Root>
