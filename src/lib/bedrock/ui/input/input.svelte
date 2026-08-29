<script lang="ts" module>
	export * from '#lib/shadcn/ui/input/input.svelte';
</script>

<script lang="ts">
	import Input from '#lib/shadcn/ui/input/input.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Input> = $props();
</script>

<Input {...props} />
