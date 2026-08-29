<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-portal.svelte';
</script>

<script lang="ts">
	import SelectPortal from '#lib/shadcn/ui/select/select-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SelectPortal> = $props();
</script>

<SelectPortal {...props} />
