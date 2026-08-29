<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-set.svelte';
</script>

<script lang="ts">
	import FieldSet from '#lib/shadcn/ui/field/field-set.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof FieldSet> = $props();
</script>

<FieldSet {...props} />
