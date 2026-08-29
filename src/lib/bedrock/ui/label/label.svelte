<script lang="ts" module>
	export * from '#lib/shadcn/ui/label/label.svelte';
</script>

<script lang="ts">
	import Label from '#lib/shadcn/ui/label/label.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Label> = $props();
</script>

<Label {...props} />
