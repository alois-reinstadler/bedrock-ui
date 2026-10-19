<script lang="ts" module>
	export * from '#lib/shadcn/ui/breadcrumb/breadcrumb.svelte';
</script>

<script lang="ts">
	import Breadcrumb from '#lib/shadcn/ui/breadcrumb/breadcrumb.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof Breadcrumb> = $props();
</script>

<Breadcrumb bind:ref {...props} />
