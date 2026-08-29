<script lang="ts" module>
	export * from '#lib/shadcn/ui/table/table-footer.svelte';
</script>

<script lang="ts">
	import TableFooter from '#lib/shadcn/ui/table/table-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TableFooter> = $props();
</script>

<TableFooter {...props} />
