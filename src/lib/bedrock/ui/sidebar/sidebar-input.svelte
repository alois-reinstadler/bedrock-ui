<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-input.svelte';
</script>

<script lang="ts">
	import SidebarInput from '#lib/shadcn/ui/sidebar/sidebar-input.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		...restProps
	}: ComponentProps<typeof SidebarInput> = $props();
</script>

<SidebarInput bind:ref bind:value {...restProps} />
