<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-content.svelte';
</script>

<script lang="ts">
	import DropdownMenuContent from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof DropdownMenuContent> = $props();
</script>

<DropdownMenuContent class={cn('motion-popover', className)} {...restProps} />
