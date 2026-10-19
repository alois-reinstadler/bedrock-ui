<script lang="ts">
	import type { Snippet } from 'svelte';
	import { trackSidebarHighlights } from './sidebar-highlights.js';
	let { children }: { children?: Snippet } = $props();
</script>

<div
	data-sidebar-highlights
	class="relative isolate flex min-h-0 flex-1 flex-col"
	{@attach trackSidebarHighlights}
>
	<span
		data-slot="sidebar-active-highlight"
		aria-hidden="true"
		class="pointer-events-none absolute rounded-md bg-sidebar-accent"
	></span>
	<span data-slot="sidebar-hover-highlight" aria-hidden="true" class="pointer-events-none absolute">
		<span data-hover-surface class="absolute inset-0 rounded-md bg-sidebar-hover corner-theme"
		></span>
	</span>
	{@render children?.()}
</div>

<style>
	[data-slot='sidebar-active-highlight'] {
		z-index: -2;
		visibility: hidden;
		transition:
			left var(--motion-layout) var(--motion-ease-enter),
			top var(--motion-layout) var(--motion-ease-enter),
			width var(--motion-layout) var(--motion-ease-enter),
			height var(--motion-layout) var(--motion-ease-enter);
	}
	[data-slot='sidebar-hover-highlight'] {
		z-index: -1;
		visibility: hidden;
		transition:
			left var(--motion-state) var(--motion-ease-enter),
			top var(--motion-state) var(--motion-ease-enter),
			width var(--motion-state) var(--motion-ease-enter),
			height var(--motion-state) var(--motion-ease-enter),
			visibility 0s linear var(--motion-state);
	}
	[data-slot]:global([data-visible='true']) {
		visibility: visible;
		transition-delay: 0s;
	}
	[data-hover-surface] {
		opacity: 0;
		translate: 0 3px;
		transition:
			opacity var(--motion-state) var(--motion-ease-enter),
			translate var(--motion-state) var(--motion-ease-enter);
	}
	[data-slot='sidebar-hover-highlight']:global([data-visible='true']) > [data-hover-surface] {
		opacity: 1;
		translate: 0 0;
	}
	:global([data-sidebar-highlight-item]:hover),
	:global([data-sidebar-highlight-item]:active),
	:global([data-sidebar-highlight-item][data-active='true']) {
		background-color: transparent;
	}
	:global([data-bedrock-motion='reduced']) [data-slot='sidebar-active-highlight'],
	:global([data-bedrock-motion='reduced']) [data-slot='sidebar-hover-highlight'],
	:global([data-bedrock-motion='reduced']) [data-hover-surface] {
		transition: none !important;
	}
	@media (prefers-reduced-motion: reduce) {
		[data-slot='sidebar-active-highlight'],
		[data-slot='sidebar-hover-highlight'],
		[data-hover-surface] {
			transition: none !important;
		}
	}
</style>
