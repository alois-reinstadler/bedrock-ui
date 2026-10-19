<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-description.svelte';
</script>

<script lang="ts">
	import SheetDescription from '#lib/shadcn/ui/sheet/sheet-description.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SheetDescription> = $props();
</script>

<SheetDescription bind:ref {...props} />
