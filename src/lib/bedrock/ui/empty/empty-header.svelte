<script lang="ts" module>
	export * from '#lib/shadcn/ui/empty/empty-header.svelte';
</script>

<script lang="ts">
	import EmptyHeader from '#lib/shadcn/ui/empty/empty-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof EmptyHeader> = $props();
</script>

<EmptyHeader {...props} />
