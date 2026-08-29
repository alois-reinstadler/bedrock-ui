<script lang="ts" module>
	export * from '#lib/shadcn/ui/breadcrumb/breadcrumb-page.svelte';
</script>

<script lang="ts">
	import BreadcrumbPage from '#lib/shadcn/ui/breadcrumb/breadcrumb-page.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof BreadcrumbPage> = $props();
</script>

<BreadcrumbPage {...props} />
