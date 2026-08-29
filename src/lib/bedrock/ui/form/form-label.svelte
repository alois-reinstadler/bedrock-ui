<script lang="ts" module>
	export * from '#lib/shadcn/ui/form/form-label.svelte';
</script>

<script lang="ts">
	import FormLabel from '#lib/shadcn/ui/form/form-label.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof FormLabel> = $props();
</script>

<FormLabel {...props} />
