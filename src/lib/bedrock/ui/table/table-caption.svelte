<script lang="ts" module>
	export * from '#lib/shadcn/ui/table/table-caption.svelte';
</script>

<script lang="ts">
	import TableCaption from '#lib/shadcn/ui/table/table-caption.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof TableCaption> = $props();
</script>

<TableCaption bind:ref {...props} />
