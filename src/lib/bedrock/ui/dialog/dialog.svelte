<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog.svelte';
</script>

<script lang="ts">
	import Dialog from '#lib/shadcn/ui/dialog/dialog.svelte';
	import type { ComponentProps } from 'svelte';

	let { open = $bindable(false), ...props }: ComponentProps<typeof Dialog> = $props();
</script>

<Dialog bind:open {...props} />
