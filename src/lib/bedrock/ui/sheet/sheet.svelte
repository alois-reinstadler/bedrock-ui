<script lang="ts" module>
	export * from '#lib/shadcn/ui/sheet/sheet.svelte';
</script>

<script lang="ts">
	import Sheet from '#lib/shadcn/ui/sheet/sheet.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Sheet> = $props();
</script>

<Sheet {...props} />
