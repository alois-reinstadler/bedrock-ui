<script lang="ts" module>
	export * from '#lib/shadcn/ui/radio-group/radio-group-item.svelte';
</script>

<script lang="ts">
	import RadioGroupItem from '#lib/shadcn/ui/radio-group/radio-group-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RadioGroupItem> = $props();
</script>

<RadioGroupItem {...props} />
