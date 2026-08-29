<script lang="ts" module>
	export * from '#lib/shadcn/ui/form/form-description.svelte';
</script>

<script lang="ts">
	import FormDescription from '#lib/shadcn/ui/form/form-description.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof FormDescription> = $props();
</script>

<FormDescription {...props} />
