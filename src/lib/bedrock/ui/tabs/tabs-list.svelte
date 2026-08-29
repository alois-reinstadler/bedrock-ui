<script lang="ts" module>
	export * from '#lib/shadcn/ui/tabs/tabs-list.svelte';
</script>

<script lang="ts">
	import TabsList from '#lib/shadcn/ui/tabs/tabs-list.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TabsList> = $props();
</script>

<TabsList {...props} />
