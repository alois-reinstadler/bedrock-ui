<script lang="ts" module>
	export * from '#lib/shadcn/ui/badge/badge.svelte';
</script>

<script lang="ts">
	import Badge from '#lib/shadcn/ui/badge/badge.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Badge> = $props();
</script>

<Badge {...props} />
