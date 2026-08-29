<script lang="ts" module>
	export * from '#lib/shadcn/ui/card/card-content.svelte';
</script>

<script lang="ts">
	import CardContent from '#lib/shadcn/ui/card/card-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CardContent> = $props();
</script>

<CardContent {...props} />
