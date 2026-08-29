<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-portal.svelte';
</script>

<script lang="ts">
	import DialogPortal from '#lib/shadcn/ui/dialog/dialog-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DialogPortal> = $props();
</script>

<DialogPortal {...props} />
