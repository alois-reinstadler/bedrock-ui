<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const selectorTriggerVariants = tv({
		base: "flex w-56 items-center justify-between gap-2 text-sm font-normal whitespace-nowrap select-none motion-state outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variants: {
			size: {
				sm: 'h-7 rounded-[min(var(--radius-md),10px)] px-2.5',
				md: 'h-8 rounded-lg px-2.5',
				lg: 'h-9 rounded-lg px-3'
			},
			variant: {
				input:
					'border border-input bg-transparent shadow-xs dark:bg-input/30 dark:hover:bg-input/50',
				ghost: 'border border-transparent hover:bg-accent hover:text-accent-foreground'
			}
		},
		defaultVariants: { size: 'md', variant: 'input' }
	});

	export type SelectorSize = NonNullable<VariantProps<typeof selectorTriggerVariants>['size']>;
	export type SelectorVariant = NonNullable<
		VariantProps<typeof selectorTriggerVariants>['variant']
	>;

	const defaultLabels = {
		search: 'Search…',
		empty: 'No results.',
		clear: 'Clear selection'
	};
	export type SelectorLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import * as Command from '#lib/bedrock/ui/command';
	import { Icon } from '#lib/bedrock/ui/icon';
	import * as Popover from '#lib/bedrock/ui/popover';
	import PopoverRoot from '#lib/shadcn/ui/popover/popover.svelte';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { tick, type Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import {
		flattenSelectorItems,
		isSelectorOption,
		type SelectorItem,
		type SelectorOption
	} from './types.js';

	let {
		ref = $bindable(null),
		items,
		value = $bindable(''),
		open = $bindable(false),
		onValueChange,
		searchable = false,
		clearable = false,
		placeholder = 'Select…',
		disabled = false,
		size = 'md',
		variant = 'input',
		labels: labelOverrides = {},
		option,
		selected,
		dataSlot = 'selector',
		class: className,
		...restProps
	}: WithElementRef<Omit<HTMLButtonAttributes, 'value' | 'disabled'>, HTMLButtonElement> & {
		items: SelectorItem[];
		/** Selected option value; controlled/bindable. */
		value?: string;
		open?: boolean;
		onValueChange?: (value: string) => void;
		/** Show the visible search input above the list. */
		searchable?: boolean;
		/** Show a clear button in the trigger while a value is set. */
		clearable?: boolean;
		placeholder?: string;
		disabled?: boolean;
		size?: SelectorSize;
		variant?: SelectorVariant;
		labels?: SelectorLabels;
		/** Custom row content for every option. */
		option?: Snippet<[SelectorOption]>;
		/** Custom trigger content for the selected option. */
		selected?: Snippet<[SelectorOption]>;
		/** data-slot prefix, e.g. for the Combobox façade. */
		dataSlot?: string;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const options = $derived(flattenSelectorItems(items));
	const selectedOption = $derived(options.find((entry) => entry.value === value));
	const showClear = $derived(clearable && value !== '' && !disabled);

	function select(next: string) {
		value = next;
		onValueChange?.(value);
		open = false;
		// Return focus to the trigger so keyboard users keep their place.
		tick().then(() => ref?.focus());
	}

	function clear() {
		value = '';
		onValueChange?.(value);
		ref?.focus();
	}

	function itemKey(item: SelectorItem, index: number) {
		return isSelectorOption(item) ? item.value : `${item.type}-${index}`;
	}
</script>

{#snippet optionRow(entry: SelectorOption)}
	<Command.Item
		value={entry.label}
		keywords={entry.description ? [entry.description] : undefined}
		disabled={entry.disabled}
		data-checked={entry.value === value ? 'true' : undefined}
		data-slot="{dataSlot}-item"
		onSelect={() => select(entry.value)}
	>
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
						!selectedOption && 'text-muted-foreground',
						className
					)}
				>
					<span class="flex min-w-0 flex-1 items-center gap-2">
						{#if selectedOption}
							{#if selected}
								{@render selected(selectedOption)}
							{:else}
								{#if selectedOption.icon}
									<Icon icon={selectedOption.icon} class="text-muted-foreground" />
								{/if}
								<span class="truncate">{selectedOption.label}</span>
							{/if}
						{:else}
							<span class="truncate">{placeholder}</span>
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
