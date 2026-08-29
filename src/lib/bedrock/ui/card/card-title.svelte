<script lang="ts" module>
	export * from '#lib/shadcn/ui/card/card-title.svelte';
</script>

<script lang="ts">
	import CardTitle from '#lib/shadcn/ui/card/card-title.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CardTitle> = $props();
</script>

<CardTitle {...props} />
