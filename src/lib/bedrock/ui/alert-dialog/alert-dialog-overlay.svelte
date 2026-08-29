<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-overlay.svelte';
</script>

<script lang="ts">
	import AlertDialogOverlay from '#lib/shadcn/ui/alert-dialog/alert-dialog-overlay.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialogOverlay> = $props();
</script>

<AlertDialogOverlay {...props} />
