<script lang="ts" module>
	export * from '#lib/shadcn/ui/breadcrumb/breadcrumb-ellipsis.svelte';
</script>

<script lang="ts">
	import BreadcrumbEllipsis from '#lib/shadcn/ui/breadcrumb/breadcrumb-ellipsis.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof BreadcrumbEllipsis> = $props();
</script>

<BreadcrumbEllipsis {...props} />
