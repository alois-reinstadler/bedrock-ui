<script lang="ts" module>
	export * from '#lib/shadcn/ui/tooltip/tooltip-content.svelte';
</script>

<script lang="ts">
	import TooltipContent from '#lib/shadcn/ui/tooltip/tooltip-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof TooltipContent> = $props();
</script>

<TooltipContent class={cn('motion-hint', className)} {...restProps} />
