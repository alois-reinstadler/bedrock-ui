<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-sub-content.svelte';
</script>

<script lang="ts">
	import ContextMenuSubContent from '#lib/shadcn/ui/context-menu/context-menu-sub-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof ContextMenuSubContent> = $props();
</script>

<ContextMenuSubContent class={cn('motion-popover', className)} {...restProps} />
