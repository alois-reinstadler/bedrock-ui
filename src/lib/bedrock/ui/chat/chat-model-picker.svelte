<script lang="ts" module>
	const defaultLabels = {
		model: 'Model',
		placeholder: 'Choose model',
		search: 'Search models…',
		empty: 'No models found.',
		all: 'All models',
		favorites: 'Favorites',
		other: 'Other',
		filters: 'Model filters',
		addFavorite: (label: string) => `Favorite ${label}`,
		removeFavorite: (label: string) => `Unfavorite ${label}`
	};
	export type ChatModelPickerLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import * as Popover from '#lib/bedrock/ui/popover';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import BotIcon from '@lucide/svelte/icons/bot';
	import StarIcon from '@lucide/svelte/icons/star';
	import GridIcon from '@lucide/svelte/icons/layout-grid';
	import { cn } from '#lib/utils.js';
	import type { ChatModelOption } from './composer-types';

	let {
		models,
		value = $bindable(''),
		favorites = $bindable([]),
		open = $bindable(false),
		showFavorites = true,
		disabled = false,
		onValueChange,
		onFavoritesChange,
		labels: overrides,
		class: className
	}: {
		models: ChatModelOption[];
		value?: string;
		favorites?: string[];
		open?: boolean;
		showFavorites?: boolean;
		disabled?: boolean;
		onValueChange?: (value: string) => void;
		onFavoritesChange?: (values: string[]) => void;
		labels?: ChatModelPickerLabels;
		class?: string;
	} = $props();
	const labels = $derived({ ...defaultLabels, ...overrides });
	let query = $state('');
	let filter = $state<{ kind: 'all' | 'favorites' | 'provider'; provider?: string }>({
		kind: 'all'
	});
	let trigger: HTMLButtonElement | null = null;
	const selected = $derived(models.find((entry) => entry.value === value));
	const providers = $derived([
		...new Set(
			models
				.map((entry) => entry.provider)
				.filter((provider): provider is string => Boolean(provider))
		)
	]);
	const filtered = $derived(
		models.filter((entry) => {
			const matchesFilter =
				filter.kind === 'all' ||
				(filter.kind === 'favorites'
					? favorites.includes(entry.value)
					: entry.provider === filter.provider);
			return (
				matchesFilter &&
				`${entry.label} ${entry.provider ?? ''} ${entry.description ?? ''} ${entry.group ?? ''}`
					.toLowerCase()
					.includes(query.trim().toLowerCase())
			);
		})
	);
	const groups = $derived([
		...new Set(filtered.map((entry) => entry.group ?? entry.provider ?? labels.other))
	]);
	function setOpen(next: boolean) {
		open = next;
		if (!next) query = '';
	}
	function choose(entry: ChatModelOption) {
		if (disabled || entry.disabled) return;
		value = entry.value;
		onValueChange?.(value);
		setOpen(false);
		void tick().then(() => trigger?.focus());
	}
	function favorite(entry: ChatModelOption) {
		if (disabled) return;
		favorites = favorites.includes(entry.value)
			? favorites.filter((id) => id !== entry.value)
			: [...favorites, entry.value];
		onFavoritesChange?.(favorites);
	}
	function navigateModels(event: KeyboardEvent) {
		const target = event.target as HTMLElement;
		if (!target.matches('input, [data-model-option]')) return;
		if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
		if (target.matches('input') && ['Home', 'End'].includes(event.key)) return;
		const options = [
			...target
				.closest('[data-model-options]')!
				.querySelectorAll<HTMLButtonElement>('[data-model-option]:not(:disabled)')
		];
		if (!options.length) return;
		event.preventDefault();
		const index = options.indexOf(target as HTMLButtonElement);
		const next =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? options.length - 1
					: event.key === 'ArrowDown'
						? (index + 1) % options.length
						: (index - 1 + options.length) % options.length;
		options[index < 0 && event.key === 'ArrowUp' ? options.length - 1 : next]?.focus();
	}

	function attachTrigger(element: HTMLButtonElement) {
		trigger = element;
		return () => {
			trigger = null;
		};
	}
</script>

<Popover.Root {open} onOpenChange={setOpen}>
	<Popover.Trigger {disabled}>
		{#snippet child({ props })}
			<Button
				{...props}
				{@attach attachTrigger}
				variant="ghost"
				size="sm"
				{disabled}
				data-slot="chat-model-picker"
				aria-label={`${labels.model}: ${selected?.label ?? labels.placeholder}`}
				class={cn('max-w-full gap-1.5 text-muted-foreground', className)}
			>
				<Icon icon={selected?.icon ?? BotIcon} /><span class="max-w-40 truncate"
					>{selected?.label ?? labels.placeholder}</span
				><Icon icon="chevronDown" class="size-3" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		side="top"
		align="start"
		class="w-80 max-w-[calc(100vw-2rem)] p-0"
		data-slot="chat-model-picker-content"
		aria-label={labels.model}
	>
		<div class="flex min-h-64">
			{#if showFavorites || providers.length > 1}
				<div
					class="flex w-11 shrink-0 flex-col items-center gap-1 border-r p-1"
					role="group"
					aria-label={labels.filters}
				>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label={labels.all}
						aria-pressed={filter.kind === 'all'}
						onclick={() => (filter = { kind: 'all' })}><GridIcon /></Button
					>
					{#if showFavorites}<Button
							variant="ghost"
							size="icon-sm"
							aria-label={labels.favorites}
							aria-pressed={filter.kind === 'favorites'}
							onclick={() => (filter = { kind: 'favorites' })}><StarIcon /></Button
						>{/if}
					{#each providers as provider (provider)}
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label={provider}
							aria-pressed={filter.kind === 'provider' && filter.provider === provider}
							onclick={() => (filter = { kind: 'provider', provider })}
							><span class="text-xs font-semibold">{provider.slice(0, 2)}</span></Button
						>
					{/each}
				</div>
			{/if}

			<div class="min-w-0 flex-1" role="group" aria-label={labels.model} data-model-options>
				<div class="border-b p-2">
					<input
						type="search"
						onkeydown={navigateModels}
						value={query}
						oninput={(event) => (query = event.currentTarget.value)}
						placeholder={labels.search}
						aria-label={labels.search}
						class="h-8 w-full min-w-0 rounded-md bg-transparent px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
				</div>
				<div class="max-h-72 overflow-y-auto p-1">
					{#if !filtered.length}<p
							class="px-3 py-6 text-center text-sm text-muted-foreground"
							role="status"
						>
							{labels.empty}
						</p>{/if}
					{#each groups as group (group)}
						<div role="group" aria-label={group}>
							<p class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{group}</p>
							{#each filtered.filter((entry) => (entry.group ?? entry.provider ?? labels.other) === group) as entry (entry.value)}
								<div class="flex items-center gap-1">
									<Button
										type="button"
										variant="ghost"
										disabled={disabled || entry.disabled}
										data-model-option={entry.value}
										onkeydown={navigateModels}
										aria-pressed={entry.value === value}
										onclick={() => choose(entry)}
										class="h-auto min-w-0 flex-1 justify-start gap-2 px-2 py-2 text-left aria-pressed:bg-muted"
									>
										<span class="flex min-w-0 flex-1 flex-col"
											><span class="truncate font-medium">{entry.label}</span
											>{#if entry.description || entry.provider}<span
													class="truncate text-xs font-normal text-muted-foreground"
													>{entry.description ?? entry.provider}</span
												>{/if}</span
										>
										{#if entry.value === value}<Icon icon="check" class="size-3" />{/if}
									</Button>
									{#if showFavorites}<Button
											type="button"
											variant="ghost"
											size="icon-xs"
											{disabled}
											aria-label={favorites.includes(entry.value)
												? labels.removeFavorite(entry.label)
												: labels.addFavorite(entry.label)}
											aria-pressed={favorites.includes(entry.value)}
											onclick={() => favorite(entry)}
											><StarIcon
												class={favorites.includes(entry.value) ? 'fill-current' : ''}
											/></Button
										>{/if}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
