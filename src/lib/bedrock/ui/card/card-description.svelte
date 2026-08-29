<script lang="ts" module>
	export * from '#lib/shadcn/ui/card/card-description.svelte';
</script>

<script lang="ts">
	import CardDescription from '#lib/shadcn/ui/card/card-description.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CardDescription> = $props();
</script>

<CardDescription {...props} />
