<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-group/input-group.svelte';
</script>

<script lang="ts">
	import InputGroup from '#lib/shadcn/ui/input-group/input-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof InputGroup> = $props();
</script>

<InputGroup {...props} />
