<script lang="ts" module>
	export * from '#lib/shadcn/ui/card/card-footer.svelte';
</script>

<script lang="ts">
	import CardFooter from '#lib/shadcn/ui/card/card-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CardFooter> = $props();
</script>

<CardFooter {...props} />
