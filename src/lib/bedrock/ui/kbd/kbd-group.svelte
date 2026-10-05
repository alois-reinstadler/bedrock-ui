<script lang="ts" module>
	export * from '#lib/shadcn/ui/kbd/kbd-group.svelte';
</script>

<script lang="ts">
	import KbdGroup from '#lib/shadcn/ui/kbd/kbd-group.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof KbdGroup> = $props();
</script>

<KbdGroup bind:ref class={cn('font-code', className)} {...restProps} />
