<script lang="ts" module>
	export * from '#lib/shadcn/ui/empty/empty-content.svelte';
</script>

<script lang="ts">
	import EmptyContent from '#lib/shadcn/ui/empty/empty-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof EmptyContent> = $props();
</script>

<EmptyContent {...props} />
