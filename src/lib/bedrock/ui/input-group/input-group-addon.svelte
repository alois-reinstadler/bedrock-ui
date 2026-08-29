<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-group/input-group-addon.svelte';
</script>

<script lang="ts">
	import InputGroupAddon from '#lib/shadcn/ui/input-group/input-group-addon.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof InputGroupAddon> = $props();
</script>

<InputGroupAddon {...props} />
