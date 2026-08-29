<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-group/input-group-textarea.svelte';
</script>

<script lang="ts">
	import InputGroupTextarea from '#lib/shadcn/ui/input-group/input-group-textarea.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof InputGroupTextarea> = $props();
</script>

<InputGroupTextarea {...props} />
