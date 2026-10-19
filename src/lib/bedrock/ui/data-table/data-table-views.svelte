<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { ALL_VIEW_KEY, type defaultLabels } from './model.js';
	let {
		views,
		activeViewKey,
		viewCounts,
		total,
		labels: l,
		onSelect: selectView
	}: {
		views: { key: string; label: string }[];
		activeViewKey: string;
		viewCounts: Map<string, number>;
		total: number;
		labels: typeof defaultLabels;
		onSelect: (key: string) => void;
	} = $props();
	// The tab strip owns its DOM measurement and observer lifetime.
	let tabIndicator = $state({ x: 0, width: 0 });
	function observeTablist(list: HTMLDivElement) {
		const measure = () => {
			const activeTab = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
			if (!activeTab) return;
			tabIndicator = {
				x: activeTab.offsetLeft + 8,
				width: Math.max(activeTab.offsetWidth - 16, 0)
			};
		};
		const sizes = new ResizeObserver(measure);
		const observeSizes = () => {
			sizes.disconnect();
			sizes.observe(list);
			for (const tab of list.querySelectorAll('[role="tab"]')) sizes.observe(tab);
		};
		observeSizes();
		const mutations = new MutationObserver(() => {
			observeSizes();
			measure();
		});
		mutations.observe(list, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
			attributeFilter: ['aria-selected']
		});
		return () => {
			sizes.disconnect();
			mutations.disconnect();
		};
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
</script>

<div
	{@attach observeTablist}
	class="relative flex items-center gap-1 overflow-x-auto border-b border-border"
	role="tablist"
	aria-label={l.views}
>
	<span
		aria-hidden="true"
		class={cn(
			'bedrock-tab-indicator absolute bottom-0 h-0.5 rounded-full bg-primary',
			tabIndicator.width === 0 && 'opacity-0'
		)}
		style:left="{tabIndicator.x}px"
		style:width="{tabIndicator.width}px"
	></span>
	<button
		type="button"
		role="tab"
		aria-selected={activeViewKey === ALL_VIEW_KEY}
		tabindex={activeViewKey === ALL_VIEW_KEY ? 0 : -1}
		class={cn(
			'min-h-11 shrink-0 px-3 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
			activeViewKey === ALL_VIEW_KEY ? 'text-foreground' : 'text-muted-foreground'
		)}
		onclick={() => selectView(ALL_VIEW_KEY)}
		onkeydown={(event: KeyboardEvent) => onTabKeydown(event, 0)}
	>
		{l.all} <span class="ml-1 tabular-nums">{total}</span>
	</button>
	{#each views as view, viewIndex (view.key)}
		{@const count = viewCounts.get(view.key) ?? 0}
		<button
			type="button"
			role="tab"
			aria-selected={activeViewKey === view.key}
			tabindex={activeViewKey === view.key ? 0 : -1}
			class={cn(
				'min-h-11 shrink-0 px-3 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
				activeViewKey === view.key ? 'text-foreground' : 'text-muted-foreground'
			)}
			onclick={() => selectView(view.key)}
			onkeydown={(event: KeyboardEvent) => onTabKeydown(event, viewIndex + 1)}
		>
			{view.label} <span class="ml-1 tabular-nums">{count}</span>
		</button>
	{/each}
</div>

<style>
	.bedrock-tab-indicator {
		pointer-events: none;
		transition:
			left var(--motion-layout) var(--motion-ease-enter),
			width var(--motion-layout) var(--motion-ease-enter),
			opacity var(--motion-state) var(--motion-ease-enter);
	}

	:global([data-bedrock-motion='reduced']) .bedrock-tab-indicator {
		transition: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.bedrock-tab-indicator {
			transition: none;
		}
	}
</style>
