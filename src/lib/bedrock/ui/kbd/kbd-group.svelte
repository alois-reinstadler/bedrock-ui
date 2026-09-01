<script lang="ts" module>
	export * from '#lib/shadcn/ui/kbd/kbd-group.svelte';
</script>

<script lang="ts">
	import KbdGroup from '#lib/shadcn/ui/kbd/kbd-group.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof KbdGroup> = $props();
</script>

<KbdGroup class={cn('font-code', className)} {...restProps} />
