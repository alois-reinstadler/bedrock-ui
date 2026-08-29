<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select.svelte';
</script>

<script lang="ts">
	import Select from '#lib/shadcn/ui/select/select.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Select> = $props();
</script>

<Select {...props} />
