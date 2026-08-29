<script lang="ts" module>
	export * from '#lib/shadcn/ui/tooltip/tooltip-trigger.svelte';
</script>

<script lang="ts">
	import TooltipTrigger from '#lib/shadcn/ui/tooltip/tooltip-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TooltipTrigger> = $props();
</script>

<TooltipTrigger {...props} />
