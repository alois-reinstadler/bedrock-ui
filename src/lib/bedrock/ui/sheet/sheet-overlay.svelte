<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-overlay.svelte';
</script>

<script lang="ts">
	import SheetOverlay from '#lib/shadcn/ui/sheet/sheet-overlay.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SheetOverlay> = $props();
</script>

<SheetOverlay {...props} />
