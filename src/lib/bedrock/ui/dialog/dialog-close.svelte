<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-close.svelte';
</script>

<script lang="ts">
	import DialogClose from '#lib/shadcn/ui/dialog/dialog-close.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DialogClose> = $props();
</script>

<DialogClose bind:ref {...props} />
