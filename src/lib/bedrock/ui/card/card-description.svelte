<script lang="ts" module>
	export * from '#lib/shadcn/ui/card/card-description.svelte';
</script>

<script lang="ts">
	import CardDescription from '#lib/shadcn/ui/card/card-description.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CardDescription> = $props();
</script>

<CardDescription bind:ref {...props} />
