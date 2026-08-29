<script lang="ts" module>
	export * from '#lib/shadcn/ui/empty/empty-title.svelte';
</script>

<script lang="ts">
	import EmptyTitle from '#lib/shadcn/ui/empty/empty-title.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof EmptyTitle> = $props();
</script>

<EmptyTitle {...props} />
