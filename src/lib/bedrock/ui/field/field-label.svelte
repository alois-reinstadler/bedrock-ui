<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-label.svelte';
</script>

<script lang="ts">
	import FieldLabel from '#lib/shadcn/ui/field/field-label.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof FieldLabel> = $props();
</script>

<FieldLabel {...props} />
