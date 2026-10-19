<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-description.svelte';
</script>

<script lang="ts">
	import DialogDescription from '#lib/shadcn/ui/dialog/dialog-description.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DialogDescription> = $props();
</script>

<DialogDescription bind:ref {...props} />
