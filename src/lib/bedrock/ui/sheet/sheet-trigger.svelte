<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-trigger.svelte';
</script>

<script lang="ts">
	import SheetTrigger from '#lib/shadcn/ui/sheet/sheet-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SheetTrigger> = $props();
</script>

<SheetTrigger bind:ref {...props} />
