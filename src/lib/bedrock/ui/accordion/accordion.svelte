<script lang="ts" module>
	export * from '#lib/shadcn/ui/accordion/accordion.svelte';
</script>

<script lang="ts">
	import Accordion from '#lib/shadcn/ui/accordion/accordion.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Accordion> = $props();
</script>

<Accordion {...props} />
