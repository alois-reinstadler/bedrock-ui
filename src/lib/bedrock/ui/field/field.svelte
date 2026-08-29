<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field.svelte';
</script>

<script lang="ts">
	import Field from '#lib/shadcn/ui/field/field.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Field> = $props();
</script>

<Field {...props} />
