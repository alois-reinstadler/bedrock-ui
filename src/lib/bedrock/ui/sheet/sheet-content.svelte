<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-content.svelte';
</script>

<script lang="ts">
	import SheetContent from '#lib/shadcn/ui/sheet/sheet-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof SheetContent> = $props();
</script>

<SheetContent class={cn('motion-drawer', className)} {...restProps} />
