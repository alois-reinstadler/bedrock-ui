<script lang="ts" module>
	export * from '#lib/shadcn/ui/toggle-group/toggle-group.svelte';
</script>

<script lang="ts">
	import ToggleGroup from '#lib/shadcn/ui/toggle-group/toggle-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ToggleGroup> = $props();
</script>

<ToggleGroup {...props} />
