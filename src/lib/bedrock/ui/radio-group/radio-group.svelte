<script lang="ts" module>
	export * from '#lib/shadcn/ui/radio-group/radio-group.svelte';
</script>

<script lang="ts">
	import RadioGroup from '#lib/shadcn/ui/radio-group/radio-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RadioGroup> = $props();
</script>

<RadioGroup {...props} />
