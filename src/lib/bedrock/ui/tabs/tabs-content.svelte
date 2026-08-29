<script lang="ts" module>
	export * from '#lib/shadcn/ui/tabs/tabs-content.svelte';
</script>

<script lang="ts">
	import TabsContent from '#lib/shadcn/ui/tabs/tabs-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TabsContent> = $props();
</script>

<TabsContent {...props} />
