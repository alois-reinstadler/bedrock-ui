<script lang="ts" module>
	export * from '#lib/shadcn/ui/empty/empty.svelte';
</script>

<script lang="ts">
	import Empty from '#lib/shadcn/ui/empty/empty.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Empty> = $props();
</script>

<Empty {...props} />
