<script lang="ts" module>
	export * from '#lib/shadcn/ui/skeleton/skeleton.svelte';
</script>

<script lang="ts">
	import Skeleton from '#lib/shadcn/ui/skeleton/skeleton.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Skeleton> = $props();
</script>

<Skeleton {...props} />
