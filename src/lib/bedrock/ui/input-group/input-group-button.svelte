<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-group/input-group-button.svelte';
</script>

<script lang="ts">
	import InputGroupButton from '#lib/shadcn/ui/input-group/input-group-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof InputGroupButton> = $props();
</script>

<InputGroupButton {...props} />
