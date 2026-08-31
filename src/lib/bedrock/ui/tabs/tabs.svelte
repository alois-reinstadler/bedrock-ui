<script lang="ts" module>
	export * from '#lib/shadcn/ui/tabs/tabs.svelte';
</script>

<script lang="ts">
	import Tabs from '#lib/shadcn/ui/tabs/tabs.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		...restProps
	}: ComponentProps<typeof Tabs> = $props();
</script>

<Tabs bind:ref bind:value {...restProps} />
