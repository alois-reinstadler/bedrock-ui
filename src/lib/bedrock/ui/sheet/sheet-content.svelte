<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-content.svelte';
</script>

<script lang="ts">
	import SheetContent from '#lib/shadcn/ui/sheet/sheet-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SheetContent> = $props();
</script>

<SheetContent {...props} />
