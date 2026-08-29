<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-footer.svelte';
</script>

<script lang="ts">
	import SheetFooter from '#lib/shadcn/ui/sheet/sheet-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SheetFooter> = $props();
</script>

<SheetFooter {...props} />
