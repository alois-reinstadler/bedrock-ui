<script lang="ts" module>
	export * from '#lib/shadcn/ui/table/table-head.svelte';
</script>

<script lang="ts">
	import TableHead from '#lib/shadcn/ui/table/table-head.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TableHead> = $props();
</script>

<TableHead {...props} />
