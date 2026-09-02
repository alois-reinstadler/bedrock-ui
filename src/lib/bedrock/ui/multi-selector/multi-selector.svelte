<script lang="ts" module>
	const defaultLabels = {
		search: 'Search…',
		empty: 'No results.',
		clear: 'Clear selection',
		selectAll: 'Select all',
		selected: (n: number) => `${n} selected`,
		more: (n: number) => `+${n}`
	};
	export type MultiSelectorLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import * as Command from '#lib/bedrock/ui/command';
	import { Icon } from '#lib/bedrock/ui/icon';
	import * as Popover from '#lib/bedrock/ui/popover';
	import {
		flattenSelectorItems,
		isSelectorOption,
		selectorTriggerVariants,
		type SelectorItem,
		type SelectorOption,
		type SelectorSize,
		type SelectorVariant
	} from '#lib/bedrock/ui/selector';
	import { Token } from '#lib/bedrock/ui/token';
	import PopoverRoot from '#lib/shadcn/ui/popover/popover.svelte';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		items,
		value = $bindable([]),
		open = $bindable(false),
		onValueChange,
		searchable = false,
		selectAll = false,
		triggerDisplay = 'count',
		maxBadges = 3,
		clearable = false,
		placeholder = 'Select…',
		disabled = false,
		size = 'md',
		variant = 'input',
		labels: labelOverrides = {},
		option,
		dataSlot = 'multi-selector',
		class: className,
		...restProps
	}: WithElementRef<Omit<HTMLButtonAttributes, 'value' | 'disabled'>, HTMLButtonElement> & {
		items: SelectorItem[];
		/** Selected option values; controlled/bindable. */
		value?: string[];
		open?: boolean;
		onValueChange?: (value: string[]) => void;
		/** Show the visible search input above the list. */
		searchable?: boolean;
		/** Show a first row toggling all enabled options. */
		selectAll?: boolean;
		/** How the trigger summarizes the selection. */
		triggerDisplay?: 'count' | 'labels' | 'badges';
		/** Badge count shown before collapsing into "+N" (badges display only). */
		maxBadges?: number;
		/** Show a clear button in the trigger while values are set. */
		clearable?: boolean;
		placeholder?: string;
		disabled?: boolean;
		size?: SelectorSize;
		variant?: SelectorVariant;
		labels?: MultiSelectorLabels;
		/** Custom row content for every option. */
		option?: Snippet<[SelectorOption]>;
		/** data-slot prefix. */
		dataSlot?: string;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const options = $derived(flattenSelectorItems(items));
	const selectedOptions = $derived(options.filter((entry) => value.includes(entry.value)));
	const enabledValues = $derived(
		options.filter((entry) => !entry.disabled).map((entry) => entry.value)
	);
	const allSelected = $derived(
		enabledValues.length > 0 && enabledValues.every((entry) => value.includes(entry))
	);
	const someSelected = $derived(enabledValues.some((entry) => value.includes(entry)));
	const showClear = $derived(clearable && value.length > 0 && !disabled);
	const visibleBadges = $derived(selectedOptions.slice(0, maxBadges));
	const overflowCount = $derived(selectedOptions.length - visibleBadges.length);

	function commit(next: string[]) {
		value = next;
		onValueChange?.(value);
	}

	function toggle(entry: string) {
		commit(value.includes(entry) ? value.filter((v) => v !== entry) : [...value, entry]);
	}

	function toggleAll() {
		if (allSelected) {
			commit(value.filter((entry) => !enabledValues.includes(entry)));
		} else {
			commit([...value, ...enabledValues.filter((entry) => !value.includes(entry))]);
		}
	}

	function clear() {
		commit([]);
		ref?.focus();
	}

	function itemKey(item: SelectorItem, index: number) {
		return isSelectorOption(item) ? item.value : `${item.type}-${index}`;
	}
</script>

{#snippet indicator(checked: boolean, partial: boolean = false)}
	<span
		aria-hidden="true"
		class={cn(
			'pointer-events-none flex size-4 shrink-0 items-center justify-center rounded-[4px] border',
			checked || partial
				? 'border-primary bg-primary text-primary-foreground'
				: 'border-input dark:bg-input/30'
		)}
	>
		{#if checked}
			<Icon icon="check" class="size-3" />
		{:else if partial}
			<span class="h-0.5 w-2 rounded-full bg-current"></span>
		{/if}
	</span>
{/snippet}

{#snippet optionRow(entry: SelectorOption)}
	<Command.Item
		value={entry.label}
		keywords={entry.description ? [entry.description] : undefined}
		disabled={entry.disabled}
		data-slot="{dataSlot}-item"
		onSelect={() => toggle(entry.value)}
	>
		{@render indicator(value.includes(entry.value))}
		{#if option}
			{@render option(entry)}
		{:else}
			{#if entry.icon}
				<Icon icon={entry.icon} class="text-muted-foreground" />
			{/if}
			<span class="flex min-w-0 flex-col">
				<span class="truncate">{entry.label}</span>
				{#if entry.description}
					<span class="truncate text-xs text-muted-foreground">{entry.description}</span>
				{/if}
			</span>
		{/if}
	</Command.Item>
{/snippet}

<PopoverRoot bind:open>
	<span class="relative inline-flex max-w-full">
		<Popover.Trigger {disabled}>
			{#snippet child({ props })}
				<button
					{...restProps}
					{...props}
					bind:this={ref}
					type="button"
					role="combobox"
					aria-expanded={open}
					data-slot="{dataSlot}-trigger"
					data-size={size}
					data-variant={variant}
					class={cn(
						selectorTriggerVariants({ size, variant }),
						value.length === 0 && 'text-muted-foreground',
						className
					)}
				>
					<span class="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
						{#if value.length === 0}
							<span class="truncate">{placeholder}</span>
						{:else if triggerDisplay === 'count'}
							<span class="truncate">{labels.selected(value.length)}</span>
						{:else if triggerDisplay === 'labels'}
							<span class="truncate">
								{selectedOptions.map((entry) => entry.label).join(', ')}
							</span>
						{:else}
							{#each visibleBadges as entry (entry.value)}
								<Token label={entry.label} icon={entry.icon} size="sm" />
							{/each}
							{#if overflowCount > 0}
								<span class="shrink-0 text-xs text-muted-foreground">
									{labels.more(overflowCount)}
								</span>
							{/if}
						{/if}
					</span>
					{#if showClear}
						<span class="size-4 shrink-0" aria-hidden="true"></span>
					{/if}
					<Icon icon="arrowsUpDown" class="text-muted-foreground/70" />
				</button>
			{/snippet}
		</Popover.Trigger>
		{#if showClear}
			<button
				type="button"
				data-slot="{dataSlot}-clear"
				class="tap-target absolute top-1/2 right-8 inline-flex size-4 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground motion-state hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				aria-label={labels.clear}
				onclick={clear}
			>
				<Icon icon="close" class="size-3.5" />
			</button>
		{/if}
	</span>
	<Popover.Content
		data-slot="{dataSlot}-content"
		class="w-(--bits-popover-anchor-width) min-w-40 p-0"
		align="start"
	>
		<Command.Root>
			{#if searchable}
				<Command.Input placeholder={labels.search} />
			{:else}
				<!-- Keep the input mounted so typing still filters; hidden from sight only. -->
				<div class="sr-only">
					<Command.Input placeholder={labels.search} />
				</div>
			{/if}
			<Command.List>
				<Command.Empty>{labels.empty}</Command.Empty>
				{#if selectAll}
					<Command.Item
						value={labels.selectAll}
						data-slot="{dataSlot}-select-all"
						onSelect={toggleAll}
					>
						{@render indicator(allSelected, someSelected && !allSelected)}
						<span class="truncate">{labels.selectAll}</span>
					</Command.Item>
					<Command.Separator />
				{/if}
				{#each items as item, index (itemKey(item, index))}
					{#if isSelectorOption(item)}
						{@render optionRow(item)}
					{:else if item.type === 'separator'}
						<Command.Separator />
					{:else}
						<Command.Group heading={item.label}>
							{#each item.items as groupOption (groupOption.value)}
								{@render optionRow(groupOption)}
							{/each}
						</Command.Group>
					{/if}
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</PopoverRoot>
