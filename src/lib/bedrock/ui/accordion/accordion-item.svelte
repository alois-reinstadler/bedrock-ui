<script lang="ts" module>
	export * from '#lib/shadcn/ui/accordion/accordion-item.svelte';
</script>

<script lang="ts">
	import AccordionItem from '#lib/shadcn/ui/accordion/accordion-item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof AccordionItem> = $props();
</script>

<AccordionItem bind:ref {...props} />
