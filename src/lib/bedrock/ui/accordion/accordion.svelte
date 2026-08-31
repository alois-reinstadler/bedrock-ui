<script lang="ts" module>
	export * from '#lib/shadcn/ui/accordion/accordion.svelte';
</script>

<script lang="ts">
	import Accordion from '#lib/shadcn/ui/accordion/accordion.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		...restProps
	}: ComponentProps<typeof Accordion> = $props();
</script>

<Accordion bind:ref bind:value={value as never} {...restProps} />
