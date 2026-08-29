<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-scroll-down-button.svelte';
</script>

<script lang="ts">
	import SelectScrollDownButton from '#lib/shadcn/ui/select/select-scroll-down-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SelectScrollDownButton> = $props();
</script>

<SelectScrollDownButton {...props} />
