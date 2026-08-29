<script lang="ts" module>
	export * from '#lib/shadcn/ui/hover-card/hover-card-trigger.svelte';
</script>

<script lang="ts">
	import HoverCardTrigger from '#lib/shadcn/ui/hover-card/hover-card-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof HoverCardTrigger> = $props();
</script>

<HoverCardTrigger {...props} />
