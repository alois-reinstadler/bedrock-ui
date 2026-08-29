<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-header.svelte';
</script>

<script lang="ts">
	import DialogHeader from '#lib/shadcn/ui/dialog/dialog-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DialogHeader> = $props();
</script>

<DialogHeader {...props} />
