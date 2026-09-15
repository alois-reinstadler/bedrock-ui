<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { createLayoutGroup } from './layout.svelte.js';

	let {
		class: className,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> & { children: Snippet } = $props();

	const group = createLayoutGroup();
	onDestroy(() => group.destroy());
</script>

<div class={cn(className)} {...rest} {@attach group.bindRoot}>
	{@render children()}
</div>
