<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		index,
		title,
		hint,
		children
	}: {
		index: string;
		title: string;
		hint: string;
		children: Snippet;
	} = $props();
</script>

<section class="flex flex-col gap-4">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="text-[10px] font-medium tracking-[0.22em] uppercase">{index}</p>
			<h2 class="mt-1 text-xl tracking-tight">{title}</h2>
		</div>
		<p class="max-w-[32ch] text-right text-xs leading-relaxed text-muted-foreground">{hint}</p>
	</div>
	{@render children()}
</section>
