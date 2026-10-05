<script lang="ts" module>
	export * from '#lib/shadcn/ui/empty/empty-title.svelte';
</script>

<script lang="ts">
	import EmptyTitle from '#lib/shadcn/ui/empty/empty-title.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof EmptyTitle> = $props();
</script>

<EmptyTitle bind:ref {...props} />
