<script lang="ts" module>
	export * from '#lib/shadcn/ui/hover-card/hover-card-content.svelte';
</script>

<script lang="ts">
	import HoverCardContent from '#lib/shadcn/ui/hover-card/hover-card-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof HoverCardContent> = $props();
</script>

<HoverCardContent {...props} />
