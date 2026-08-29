<script lang="ts" module>
	export * from '#lib/shadcn/ui/accordion/accordion-item.svelte';
</script>

<script lang="ts">
	import AccordionItem from '#lib/shadcn/ui/accordion/accordion-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AccordionItem> = $props();
</script>

<AccordionItem {...props} />
