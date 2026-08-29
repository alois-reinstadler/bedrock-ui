<script lang="ts" module>
	export * from '#lib/shadcn/ui/card/card-action.svelte';
</script>

<script lang="ts">
	import CardAction from '#lib/shadcn/ui/card/card-action.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CardAction> = $props();
</script>

<CardAction {...props} />
