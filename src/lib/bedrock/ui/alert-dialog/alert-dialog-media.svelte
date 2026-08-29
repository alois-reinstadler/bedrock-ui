<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-media.svelte';
</script>

<script lang="ts">
	import AlertDialogMedia from '#lib/shadcn/ui/alert-dialog/alert-dialog-media.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialogMedia> = $props();
</script>

<AlertDialogMedia {...props} />
