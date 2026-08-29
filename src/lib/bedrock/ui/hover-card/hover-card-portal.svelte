<script lang="ts" module>
	export * from '#lib/shadcn/ui/hover-card/hover-card-portal.svelte';
</script>

<script lang="ts">
	import HoverCardPortal from '#lib/shadcn/ui/hover-card/hover-card-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof HoverCardPortal> = $props();
</script>

<HoverCardPortal {...props} />
