<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-group/input-group-text.svelte';
</script>

<script lang="ts">
	import InputGroupText from '#lib/shadcn/ui/input-group/input-group-text.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof InputGroupText> = $props();
</script>

<InputGroupText {...props} />
