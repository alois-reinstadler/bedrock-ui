<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-portal.svelte';
</script>

<script lang="ts">
	import SheetPortal from '#lib/shadcn/ui/sheet/sheet-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SheetPortal> = $props();
</script>

<SheetPortal {...props} />
