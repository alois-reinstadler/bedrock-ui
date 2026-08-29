<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar.svelte';
</script>

<script lang="ts">
	import Sidebar from '#lib/shadcn/ui/sidebar/sidebar.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Sidebar> = $props();
</script>

<Sidebar {...props} />
