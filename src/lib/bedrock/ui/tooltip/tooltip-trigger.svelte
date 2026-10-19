<script lang="ts" module>
	export * from '#lib/shadcn/ui/tooltip/tooltip-trigger.svelte';
</script>

<script lang="ts">
	import TooltipTrigger from '#lib/shadcn/ui/tooltip/tooltip-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof TooltipTrigger> = $props();
</script>

<TooltipTrigger bind:ref {...props} />
