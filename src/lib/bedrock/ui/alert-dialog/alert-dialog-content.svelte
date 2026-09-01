<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-content.svelte';
</script>

<script lang="ts">
	import AlertDialogContent from '#lib/shadcn/ui/alert-dialog/alert-dialog-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof AlertDialogContent> = $props();
</script>

<AlertDialogContent class={cn('motion-overlay', className)} {...restProps} />
