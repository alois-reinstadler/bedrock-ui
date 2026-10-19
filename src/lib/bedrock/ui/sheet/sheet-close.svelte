<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-close.svelte';
</script>

<script lang="ts">
	import SheetClose from '#lib/shadcn/ui/sheet/sheet-close.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SheetClose> = $props();
</script>

<SheetClose bind:ref {...props} />
