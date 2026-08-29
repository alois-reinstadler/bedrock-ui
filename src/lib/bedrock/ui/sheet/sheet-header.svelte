<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-header.svelte';
</script>

<script lang="ts">
	import SheetHeader from '#lib/shadcn/ui/sheet/sheet-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SheetHeader> = $props();
</script>

<SheetHeader {...props} />
