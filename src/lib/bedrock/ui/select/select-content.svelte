<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-content.svelte';
</script>

<script lang="ts">
	import SelectContent from '#lib/shadcn/ui/select/select-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof SelectContent> = $props();
</script>

<SelectContent class={cn('motion-popover', className)} {...restProps} />
