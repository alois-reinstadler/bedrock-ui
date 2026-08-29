<script lang="ts" module>
	export * from '#lib/shadcn/ui/empty/empty-description.svelte';
</script>

<script lang="ts">
	import EmptyDescription from '#lib/shadcn/ui/empty/empty-description.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof EmptyDescription> = $props();
</script>

<EmptyDescription {...props} />
