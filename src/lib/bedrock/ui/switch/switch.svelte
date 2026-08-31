<script lang="ts" module>
	export * from '#lib/shadcn/ui/switch/switch.svelte';
</script>

<script lang="ts">
	import Switch from '#lib/shadcn/ui/switch/switch.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		...restProps
	}: ComponentProps<typeof Switch> = $props();
</script>

<Switch bind:ref bind:checked {...restProps} />
