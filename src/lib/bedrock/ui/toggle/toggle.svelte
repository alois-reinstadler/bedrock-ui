<script lang="ts" module>
	export * from '#lib/shadcn/ui/toggle/toggle.svelte';
</script>

<script lang="ts">
	import Toggle from '#lib/shadcn/ui/toggle/toggle.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		pressed = $bindable(false),
		...props
	}: ComponentProps<typeof Toggle> = $props();
</script>

<Toggle bind:ref bind:pressed {...props} />
