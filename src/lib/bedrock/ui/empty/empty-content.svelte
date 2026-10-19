<script lang="ts" module>
	export * from '#lib/shadcn/ui/empty/empty-content.svelte';
</script>

<script lang="ts">
	import EmptyContent from '#lib/shadcn/ui/empty/empty-content.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof EmptyContent> = $props();
</script>

<EmptyContent bind:ref {...props} />
