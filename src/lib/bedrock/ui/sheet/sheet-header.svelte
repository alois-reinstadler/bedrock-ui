<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-header.svelte';
</script>

<script lang="ts">
	import SheetHeader from '#lib/shadcn/ui/sheet/sheet-header.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SheetHeader> = $props();
</script>

<SheetHeader bind:ref {...props} />
