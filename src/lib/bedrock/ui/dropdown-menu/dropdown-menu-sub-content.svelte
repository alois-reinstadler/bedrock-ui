<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-sub-content.svelte';
</script>

<script lang="ts">
	import DropdownMenuSubContent from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-sub-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof DropdownMenuSubContent> = $props();
</script>

<DropdownMenuSubContent class={cn('motion-popover', className)} {...restProps} />
