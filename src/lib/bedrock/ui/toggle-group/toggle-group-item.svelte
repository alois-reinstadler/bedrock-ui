<script lang="ts" module>
	export * from '#lib/shadcn/ui/toggle-group/toggle-group-item.svelte';
</script>

<script lang="ts">
	import ToggleGroupItem from '#lib/shadcn/ui/toggle-group/toggle-group-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ToggleGroupItem> = $props();
</script>

<ToggleGroupItem {...props} />
