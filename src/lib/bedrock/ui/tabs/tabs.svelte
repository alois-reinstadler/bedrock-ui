<script lang="ts" module>
	export * from '#lib/shadcn/ui/tabs/tabs.svelte';
</script>

<script lang="ts">
	import Tabs from '#lib/shadcn/ui/tabs/tabs.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Tabs> = $props();
</script>

<Tabs {...props} />
