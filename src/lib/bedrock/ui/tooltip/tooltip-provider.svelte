<script lang="ts" module>
	export * from '#lib/shadcn/ui/tooltip/tooltip-provider.svelte';
</script>

<script lang="ts">
	import TooltipProvider from '#lib/shadcn/ui/tooltip/tooltip-provider.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TooltipProvider> = $props();
</script>

<TooltipProvider {...props} />
