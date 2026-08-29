<script lang="ts" module>
	export * from '#lib/shadcn/ui/breadcrumb/breadcrumb-link.svelte';
</script>

<script lang="ts">
	import BreadcrumbLink from '#lib/shadcn/ui/breadcrumb/breadcrumb-link.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof BreadcrumbLink> = $props();
</script>

<BreadcrumbLink {...props} />
