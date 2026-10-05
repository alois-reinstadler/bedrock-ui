<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-trigger.svelte';
</script>

<script lang="ts">
	import PopoverTrigger from '#lib/shadcn/ui/popover/popover-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof PopoverTrigger> = $props();
</script>

<PopoverTrigger bind:ref {...props} />
