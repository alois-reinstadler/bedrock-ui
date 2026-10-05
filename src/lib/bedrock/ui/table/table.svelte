<script lang="ts" module>
	export * from '#lib/shadcn/ui/table/table.svelte';
</script>

<script lang="ts">
	import Table from '#lib/shadcn/ui/table/table.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof Table> = $props();
</script>

<Table bind:ref {...props} />
