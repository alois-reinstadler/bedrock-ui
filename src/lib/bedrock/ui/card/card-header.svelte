<script lang="ts" module>
	export * from '#lib/shadcn/ui/card/card-header.svelte';
</script>

<script lang="ts">
	import CardHeader from '#lib/shadcn/ui/card/card-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CardHeader> = $props();
</script>

<CardHeader {...props} />
