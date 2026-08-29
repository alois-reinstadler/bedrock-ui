<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-overlay.svelte';
</script>

<script lang="ts">
	import DialogOverlay from '#lib/shadcn/ui/dialog/dialog-overlay.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DialogOverlay> = $props();
</script>

<DialogOverlay {...props} />
