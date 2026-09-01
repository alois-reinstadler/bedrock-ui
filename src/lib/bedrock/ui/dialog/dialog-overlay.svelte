<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-overlay.svelte';
</script>

<script lang="ts">
	import DialogOverlay from '#lib/shadcn/ui/dialog/dialog-overlay.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof DialogOverlay> = $props();
</script>

<DialogOverlay class={cn('motion-overlay', className)} {...restProps} />
