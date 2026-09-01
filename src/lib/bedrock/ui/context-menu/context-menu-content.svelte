<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-content.svelte';
</script>

<script lang="ts">
	import ContextMenuContent from '#lib/shadcn/ui/context-menu/context-menu-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof ContextMenuContent> = $props();
</script>

<ContextMenuContent class={cn('motion-popover', className)} {...restProps} />
