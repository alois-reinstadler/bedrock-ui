<script lang="ts" module>
	export * from '#lib/shadcn/ui/empty/empty-media.svelte';
</script>

<script lang="ts">
	import EmptyMedia from '#lib/shadcn/ui/empty/empty-media.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof EmptyMedia> = $props();
</script>

<EmptyMedia {...props} />
