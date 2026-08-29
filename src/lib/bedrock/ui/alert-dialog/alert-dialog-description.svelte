<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-description.svelte';
</script>

<script lang="ts">
	import AlertDialogDescription from '#lib/shadcn/ui/alert-dialog/alert-dialog-description.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialogDescription> = $props();
</script>

<AlertDialogDescription {...props} />
