<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-content.svelte';
</script>

<script lang="ts">
	import AlertDialogContent from '#lib/shadcn/ui/alert-dialog/alert-dialog-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialogContent> = $props();
</script>

<AlertDialogContent {...props} />
