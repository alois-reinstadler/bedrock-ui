<script lang="ts" module>
	export * from '#lib/shadcn/ui/tabs/tabs-trigger.svelte';
</script>

<script lang="ts">
	import TabsTrigger from '#lib/shadcn/ui/tabs/tabs-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TabsTrigger> = $props();
</script>

<TabsTrigger {...props} />
