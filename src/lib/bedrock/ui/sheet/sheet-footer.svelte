<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-footer.svelte';
</script>

<script lang="ts">
	import SheetFooter from '#lib/shadcn/ui/sheet/sheet-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SheetFooter> = $props();
</script>

<SheetFooter bind:ref {...props} />
