<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-content.svelte';
</script>

<script lang="ts">
	import PopoverContent from '#lib/shadcn/ui/popover/popover-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof PopoverContent> = $props();
</script>

<PopoverContent class={cn('motion-popover', className)} {...restProps} />
