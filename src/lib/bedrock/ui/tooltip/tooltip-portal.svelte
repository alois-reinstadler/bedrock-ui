<script lang="ts" module>
	export * from '#lib/shadcn/ui/tooltip/tooltip-portal.svelte';
</script>

<script lang="ts">
	import TooltipPortal from '#lib/shadcn/ui/tooltip/tooltip-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TooltipPortal> = $props();
</script>

<TooltipPortal {...props} />
