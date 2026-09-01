<script lang="ts" module>
	export * from '#lib/shadcn/ui/hover-card/hover-card-content.svelte';
</script>

<script lang="ts">
	import HoverCardContent from '#lib/shadcn/ui/hover-card/hover-card-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof HoverCardContent> = $props();
</script>

<HoverCardContent class={cn('motion-popover', className)} {...restProps} />
