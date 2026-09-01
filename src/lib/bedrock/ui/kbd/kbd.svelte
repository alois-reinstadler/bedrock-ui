<script lang="ts" module>
	export * from '#lib/shadcn/ui/kbd/kbd.svelte';
</script>

<script lang="ts">
	import Kbd from '#lib/shadcn/ui/kbd/kbd.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof Kbd> = $props();
</script>

<Kbd class={cn('font-code', className)} {...restProps} />
