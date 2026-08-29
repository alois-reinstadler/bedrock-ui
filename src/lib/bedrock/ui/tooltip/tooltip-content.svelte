<script lang="ts" module>
	export * from '#lib/shadcn/ui/tooltip/tooltip-content.svelte';
</script>

<script lang="ts">
	import TooltipContent from '#lib/shadcn/ui/tooltip/tooltip-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TooltipContent> = $props();
</script>

<TooltipContent {...props} />
