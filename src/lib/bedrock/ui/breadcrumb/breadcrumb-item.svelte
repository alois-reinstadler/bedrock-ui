<script lang="ts" module>
	export * from '#lib/shadcn/ui/breadcrumb/breadcrumb-item.svelte';
</script>

<script lang="ts">
	import BreadcrumbItem from '#lib/shadcn/ui/breadcrumb/breadcrumb-item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof BreadcrumbItem> = $props();
</script>

<BreadcrumbItem bind:ref {...props} />
