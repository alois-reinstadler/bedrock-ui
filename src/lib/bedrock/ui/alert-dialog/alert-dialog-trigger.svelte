<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-trigger.svelte';
</script>

<script lang="ts">
	import AlertDialogTrigger from '#lib/shadcn/ui/alert-dialog/alert-dialog-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialogTrigger> = $props();
</script>

<AlertDialogTrigger {...props} />
