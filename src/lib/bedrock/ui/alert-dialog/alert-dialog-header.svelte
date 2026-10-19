<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-header.svelte';
</script>

<script lang="ts">
	import AlertDialogHeader from '#lib/shadcn/ui/alert-dialog/alert-dialog-header.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof AlertDialogHeader> = $props();
</script>

<AlertDialogHeader bind:ref {...props} />
