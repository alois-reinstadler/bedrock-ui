<script lang="ts" module>
	const defaultLabels = {
		empty: 'No results.',
		remove: (label: string) => `Remove ${label}`,
		create: (query: string) => `Create "${query}"`,
		added: (label: string) => `Added ${label}`,
		removed: (label: string) => `Removed ${label}`
	};
	export type TokenizerLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import { Icon } from '#lib/bedrock/ui/icon';
	import type { SelectorOption } from '#lib/bedrock/ui/selector';
	import { Token } from '#lib/bedrock/ui/token';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type ChangeInfo = { type: 'add' | 'remove' | 'create'; value: string };
	type ListEntry = { kind: 'option'; option: SelectorOption } | { kind: 'create'; query: string };

	let {
		ref = $bindable(null),
		value = $bindable([]),
		options,
		onValueChange,
		filter,
		create = false,
		maxItems,
		placeholder,
		disabled = false,
		labels: labelOverrides = {},
		token,
		option,
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		/** Selected values; controlled/bindable. Created values appear verbatim. */
		value?: string[];
		/** Synchronous option source. */
		options: SelectorOption[];
		onValueChange?: (value: string[], change: ChangeInfo) => void;
		/** Custom match predicate; default is a case-insensitive label match. */
		filter?: (query: string, option: SelectorOption) => boolean;
		/** Allow free text: Enter on no exact match adds the query verbatim. */
		create?: boolean;
		/** Hide the input once this many values are selected. */
		maxItems?: number;
		/** Shown only while nothing is selected. */
		placeholder?: string;
		disabled?: boolean;
		labels?: TokenizerLabels;
		/** Custom chip content per selected option. */
		token?: Snippet<[SelectorOption]>;
		/** Custom list row content per option. */
		option?: Snippet<[SelectorOption]>;
	} = $props();

	const uid = $props.id();
	const listId = `${uid}-list`;

	let query = $state('');
	let open = $state(false);
	let highlighted = $state(0);
	let announcement = $state('');
	let inputRef = $state<HTMLInputElement | null>(null);
	let chipRefs = $state<(HTMLElement | null)[]>([]);

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const atLimit = $derived(maxItems !== undefined && value.length >= maxItems);
	const chips = $derived(
		value.map(
			(entry) =>
				options.find((candidate) => candidate.value === entry) ?? { value: entry, label: entry }
		)
	);
	const matches = $derived(
		options.filter(
			(candidate) =>
				!value.includes(candidate.value) &&
				(filter
					? filter(query, candidate)
					: candidate.label.toLowerCase().includes(query.toLowerCase()))
		)
	);
	const showCreate = $derived(
		create &&
			query.trim() !== '' &&
			!value.includes(query) &&
			!options.some((candidate) => candidate.label.toLowerCase() === query.toLowerCase())
	);
	const entries: ListEntry[] = $derived([
		...matches.map((match): ListEntry => ({ kind: 'option', option: match })),
		...(showCreate ? [{ kind: 'create', query } satisfies ListEntry] : [])
	]);
	const listOpen = $derived(open && !atLimit && !disabled);
	const activeIndex = $derived(Math.min(highlighted, Math.max(entries.length - 1, 0)));
	const activeId = $derived(
		listOpen && entries.length > 0 ? `${uid}-entry-${activeIndex}` : undefined
	);

	function commit(next: string[], change: ChangeInfo) {
		value = next;
		onValueChange?.(value, change);
	}

	function add(entry: string, type: 'add' | 'create') {
		if (atLimit || value.includes(entry)) return;
		commit([...value, entry], { type, value: entry });
		const label = options.find((candidate) => candidate.value === entry)?.label ?? entry;
		announcement = labels.added(label);
		query = '';
		highlighted = 0;
	}

	function remove(entry: string, focusTarget?: number) {
		commit(
			value.filter((candidate) => candidate !== entry),
			{ type: 'remove', value: entry }
		);
		const label = options.find((candidate) => candidate.value === entry)?.label ?? entry;
		announcement = labels.removed(label);
		if (focusTarget !== undefined && focusTarget >= 0) {
			chipRefs[focusTarget]?.focus();
		} else {
			inputRef?.focus();
		}
	}

	function selectEntry(entry: ListEntry) {
		if (entry.kind === 'option') {
			add(entry.option.value, 'add');
		} else {
			add(entry.query, 'create');
		}
		inputRef?.focus();
	}

	function handleInputKeydown(event: KeyboardEvent) {
		const input = event.currentTarget as HTMLInputElement;
		if (event.key === 'Backspace' && query === '' && value.length > 0) {
			remove(value[value.length - 1]);
			return;
		}
		if (
			event.key === 'ArrowLeft' &&
			input.selectionStart === 0 &&
			input.selectionEnd === 0 &&
			chips.length > 0
		) {
			event.preventDefault();
			chipRefs[chips.length - 1]?.focus();
			return;
		}
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (listOpen) highlighted = Math.min(activeIndex + 1, entries.length - 1);
			else open = true;
			return;
		}
		if (event.key === 'ArrowUp' && listOpen) {
			event.preventDefault();
			highlighted = Math.max(activeIndex - 1, 0);
			return;
		}
		if (event.key === 'Enter') {
			if (listOpen && entries.length > 0) {
				event.preventDefault();
				selectEntry(entries[activeIndex]);
			}
			return;
		}
		if (event.key === 'Escape' && listOpen) {
			event.preventDefault();
			open = false;
		}
	}

	function handleChipKeydown(index: number, entry: string) {
		return (event: KeyboardEvent) => {
			if (event.key === 'Backspace' || event.key === 'Delete') {
				event.preventDefault();
				remove(entry, index - 1);
			} else if (event.key === 'ArrowLeft' && index > 0) {
				event.preventDefault();
				chipRefs[index - 1]?.focus();
			} else if (event.key === 'ArrowRight') {
				event.preventDefault();
				if (index < chips.length - 1) chipRefs[index + 1]?.focus();
				else inputRef?.focus();
			}
		};
	}

	function handleFocusOut(event: FocusEvent) {
		const next = event.relatedTarget;
		if (!(next instanceof Node) || !ref?.contains(next)) open = false;
	}
</script>

<div
	{...restProps}
	bind:this={ref}
	data-slot="tokenizer"
	data-disabled={disabled ? 'true' : undefined}
	class={cn(
		'relative flex min-h-9 w-full flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent px-2 py-1 text-sm shadow-xs motion-state focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30',
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
	{#each chips as chip, index (chip.value)}
		{#if token}
			<span class="inline-flex max-w-full items-center" data-slot="tokenizer-token">
				<button
					bind:this={chipRefs[index]}
					type="button"
					tabindex={-1}
					{disabled}
					class="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onkeydown={handleChipKeydown(index, chip.value)}
				>
					{@render token(chip)}
				</button>
				<button
					type="button"
					class="tap-target -ml-1 inline-flex size-5 items-center justify-center rounded-md motion-state focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
					aria-label={labels.remove(chip.label)}
					{disabled}
					onclick={() => remove(chip.value)}
				>
					<Icon icon="close" class="size-3" />
				</button>
			</span>
		{:else}
			<Token
				bind:ref={() => chipRefs[index] ?? null, (element) => (chipRefs[index] = element)}
				label={chip.label}
				icon={chip.icon}
				size="sm"
				{disabled}
				tabindex={-1}
				data-slot="tokenizer-token"
				onclick={() => chipRefs[index]?.focus()}
				onkeydown={handleChipKeydown(index, chip.value)}
				onRemove={disabled ? undefined : () => remove(chip.value)}
				labels={{ remove: labels.remove }}
			/>
		{/if}
	{/each}
	{#if !atLimit}
		<input
			bind:this={inputRef}
			bind:value={query}
			type="text"
			role="combobox"
			aria-expanded={listOpen}
			aria-controls={listId}
			aria-autocomplete="list"
			aria-activedescendant={activeId}
			data-slot="tokenizer-input"
			class="h-6 min-w-24 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
			placeholder={value.length === 0 ? placeholder : undefined}
			{disabled}
			oninput={() => {
				open = true;
				highlighted = 0;
			}}
			onkeydown={handleInputKeydown}
		/>
	{/if}
	<span role="status" aria-live="polite" class="sr-only">{announcement}</span>
	{#if listOpen}
		<div
			id={listId}
			role="listbox"
			data-slot="tokenizer-list"
			class="absolute top-full left-0 z-50 mt-1 max-h-64 w-full motion-popover overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
		>
			{#if entries.length === 0}
				<div class="px-2 py-1.5 text-sm text-muted-foreground">{labels.empty}</div>
			{/if}
			{#each entries as entry, index (entry.kind === 'option' ? entry.option.value : '__create__')}
				<button
					id={`${uid}-entry-${index}`}
					type="button"
					role="option"
					tabindex={-1}
					aria-selected={index === activeIndex}
					data-highlighted={index === activeIndex ? 'true' : undefined}
					data-slot="tokenizer-option"
					class="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm select-none data-[highlighted=true]:bg-muted"
					onpointerdown={(event) => event.preventDefault()}
					onpointermove={() => (highlighted = index)}
					onclick={() => selectEntry(entry)}
				>
					{#if entry.kind === 'create'}
						<Icon icon="add" class="text-muted-foreground" />
						<span class="truncate">{labels.create(entry.query)}</span>
					{:else if option}
						{@render option(entry.option)}
					{:else}
						{#if entry.option.icon}
							<Icon icon={entry.option.icon} class="text-muted-foreground" />
						{/if}
						<span class="flex min-w-0 flex-col">
							<span class="truncate">{entry.option.label}</span>
							{#if entry.option.description}
								<span class="truncate text-xs text-muted-foreground">
									{entry.option.description}
								</span>
							{/if}
						</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
