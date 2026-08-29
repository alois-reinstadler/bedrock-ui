<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-label.svelte';
</script>

<script lang="ts">
	import SelectLabel from '#lib/shadcn/ui/select/select-label.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SelectLabel> = $props();
</script>

<SelectLabel {...props} />
