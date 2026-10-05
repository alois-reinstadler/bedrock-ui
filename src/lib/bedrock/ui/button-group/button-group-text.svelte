<script lang="ts" module>
	export * from '#lib/shadcn/ui/button-group/button-group-text.svelte';
</script>

<script lang="ts">
	import ButtonGroupText from '#lib/shadcn/ui/button-group/button-group-text.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ButtonGroupText> = $props();
</script>

<ButtonGroupText bind:ref {...props} />
