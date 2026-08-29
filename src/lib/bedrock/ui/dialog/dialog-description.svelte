<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-description.svelte';
</script>

<script lang="ts">
	import DialogDescription from '#lib/shadcn/ui/dialog/dialog-description.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DialogDescription> = $props();
</script>

<DialogDescription {...props} />
