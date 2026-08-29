<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-scroll-up-button.svelte';
</script>

<script lang="ts">
	import SelectScrollUpButton from '#lib/shadcn/ui/select/select-scroll-up-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SelectScrollUpButton> = $props();
</script>

<SelectScrollUpButton {...props} />
