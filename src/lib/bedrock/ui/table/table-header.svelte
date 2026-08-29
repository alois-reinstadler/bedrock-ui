<script lang="ts" module>
	export * from '#lib/shadcn/ui/table/table-header.svelte';
</script>

<script lang="ts">
	import TableHeader from '#lib/shadcn/ui/table/table-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TableHeader> = $props();
</script>

<TableHeader {...props} />
