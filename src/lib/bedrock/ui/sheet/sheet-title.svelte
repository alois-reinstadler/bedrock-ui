<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet-title.svelte';
</script>

<script lang="ts">
	import SheetTitle from '#lib/shadcn/ui/sheet/sheet-title.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SheetTitle> = $props();
</script>

<SheetTitle {...props} />
