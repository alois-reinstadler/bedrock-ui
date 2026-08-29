<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-content.svelte';
</script>

<script lang="ts">
	import DialogContent from '#lib/shadcn/ui/dialog/dialog-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DialogContent> = $props();
</script>

<DialogContent {...props} />
