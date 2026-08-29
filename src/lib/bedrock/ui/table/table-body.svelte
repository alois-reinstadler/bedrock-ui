<script lang="ts" module>
	export * from '#lib/shadcn/ui/table/table-body.svelte';
</script>

<script lang="ts">
	import TableBody from '#lib/shadcn/ui/table/table-body.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TableBody> = $props();
</script>

<TableBody {...props} />
