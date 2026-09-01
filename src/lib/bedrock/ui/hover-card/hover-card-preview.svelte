<script lang="ts">
	import HoverCardContent from '#lib/shadcn/ui/hover-card/hover-card-content.svelte';
	import HoverCardTrigger from '#lib/shadcn/ui/hover-card/hover-card-trigger.svelte';
	import HoverCardRoot from '#lib/shadcn/ui/hover-card/hover-card.svelte';
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';

	let {
		openDelay = 200,
		closeDelay = 100,
		align = 'center',
		sideOffset = 6,
		contentClass,
		trigger,
		children
	}: {
		openDelay?: number;
		closeDelay?: number;
		align?: 'start' | 'center' | 'end';
		sideOffset?: number;
		contentClass?: string;
		/** Receives the trigger props to spread onto a focusable element. */
		trigger: Snippet<[{ props: Record<string, unknown> }]>;
		children: Snippet;
	} = $props();
</script>

<!-- Shared preview layout: a hover/focus-triggered card that lists related
	items with consistent spacing, used by OverflowList, AvatarStack, etc. -->
<HoverCardRoot {openDelay} {closeDelay}>
	<HoverCardTrigger>
		{#snippet child({ props })}
			{@render trigger({ props })}
		{/snippet}
	</HoverCardTrigger>
	<HoverCardContent
		data-slot="hover-card-preview"
		{align}
		{sideOffset}
		class={cn('w-auto max-w-72', contentClass)}
	>
		<div class="flex flex-wrap items-center gap-1.5">
			{@render children()}
		</div>
	</HoverCardContent>
</HoverCardRoot>
