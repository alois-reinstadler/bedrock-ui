<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-overlay.svelte';
</script>

<script lang="ts">
	import SheetOverlay from '#lib/shadcn/ui/sheet/sheet-overlay.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof SheetOverlay> = $props();
</script>

<SheetOverlay class={cn('motion-overlay', className)} {...restProps} />
