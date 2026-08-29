<script lang="ts" module>
	export * from '#lib/shadcn/ui/button-group/button-group-separator.svelte';
</script>

<script lang="ts">
	import ButtonGroupSeparator from '#lib/shadcn/ui/button-group/button-group-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ButtonGroupSeparator> = $props();
</script>

<ButtonGroupSeparator {...props} />
