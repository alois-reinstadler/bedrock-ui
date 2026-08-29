<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-trigger.svelte';
</script>

<script lang="ts">
	import SelectTrigger from '#lib/shadcn/ui/select/select-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SelectTrigger> = $props();
</script>

<SelectTrigger {...props} />
