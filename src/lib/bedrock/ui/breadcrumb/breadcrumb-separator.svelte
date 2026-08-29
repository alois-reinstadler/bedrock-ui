<script lang="ts" module>
	export * from '#lib/shadcn/ui/breadcrumb/breadcrumb-separator.svelte';
</script>

<script lang="ts">
	import BreadcrumbSeparator from '#lib/shadcn/ui/breadcrumb/breadcrumb-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof BreadcrumbSeparator> = $props();
</script>

<BreadcrumbSeparator {...props} />
