<script lang="ts" module>
	export * from '#lib/shadcn/ui/card/card-content.svelte';
</script>

<script lang="ts">
	import CardContent from '#lib/shadcn/ui/card/card-content.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CardContent> = $props();
</script>

<CardContent bind:ref {...props} />
