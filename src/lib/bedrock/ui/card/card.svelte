<script lang="ts" module>
	export * from '#lib/shadcn/ui/card/card.svelte';
</script>

<script lang="ts">
	import Card from '#lib/shadcn/ui/card/card.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Card> = $props();
</script>

<Card {...props} />
