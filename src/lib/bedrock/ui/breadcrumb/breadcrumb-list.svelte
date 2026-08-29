<script lang="ts" module>
	export * from '#lib/shadcn/ui/breadcrumb/breadcrumb-list.svelte';
</script>

<script lang="ts">
	import BreadcrumbList from '#lib/shadcn/ui/breadcrumb/breadcrumb-list.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof BreadcrumbList> = $props();
</script>

<BreadcrumbList {...props} />
