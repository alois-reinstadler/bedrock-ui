<script lang="ts" module>
	export * from '#lib/shadcn/ui/button-group/button-group.svelte';
</script>

<script lang="ts">
	import ButtonGroup from '#lib/shadcn/ui/button-group/button-group.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ButtonGroup> = $props();
</script>

<ButtonGroup bind:ref {...props} />
