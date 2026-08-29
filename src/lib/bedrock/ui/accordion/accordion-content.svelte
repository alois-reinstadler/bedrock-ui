<script lang="ts" module>
	export * from '#lib/shadcn/ui/accordion/accordion-content.svelte';
</script>

<script lang="ts">
	import AccordionContent from '#lib/shadcn/ui/accordion/accordion-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AccordionContent> = $props();
</script>

<AccordionContent {...props} />
