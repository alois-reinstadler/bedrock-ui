<script lang="ts" module>
	export * from '#lib/shadcn/ui/accordion/accordion-trigger.svelte';
</script>

<script lang="ts">
	import AccordionTrigger from '#lib/shadcn/ui/accordion/accordion-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof AccordionTrigger> = $props();
</script>

<AccordionTrigger bind:ref {...props} />
