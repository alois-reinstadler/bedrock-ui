<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-title.svelte';
</script>

<script lang="ts">
	import PopoverTitle from '#lib/shadcn/ui/popover/popover-title.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PopoverTitle> = $props();
</script>

<PopoverTitle {...props} />
