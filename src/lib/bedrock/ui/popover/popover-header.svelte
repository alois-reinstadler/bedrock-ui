<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-header.svelte';
</script>

<script lang="ts">
	import PopoverHeader from '#lib/shadcn/ui/popover/popover-header.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof PopoverHeader> = $props();
</script>

<PopoverHeader bind:ref {...props} />
