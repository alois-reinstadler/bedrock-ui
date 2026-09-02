<script lang="ts">
	import Outline, { type OutlineItem } from './outline.svelte';

	let {
		items,
		activeId = undefined,
		scrollSpy = false,
		withTargets = true,
		onNavigateStart,
		onNavigateEnd
	}: {
		items: OutlineItem[];
		activeId?: string;
		scrollSpy?: boolean;
		withTargets?: boolean;
		onNavigateStart?: (id: string) => void;
		onNavigateEnd?: (id: string) => void;
	} = $props();
</script>

{#if withTargets}
	{#each items as item (item.id)}
		<h2 id={item.id}>{item.label}</h2>
	{/each}
{/if}

<Outline {items} bind:activeId {scrollSpy} {onNavigateStart} {onNavigateEnd} />

<output data-testid="active-id">{activeId ?? ''}</output>
