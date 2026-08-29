<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-link-item.svelte';
</script>

<script lang="ts">
	import CommandLinkItem from '#lib/shadcn/ui/command/command-link-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CommandLinkItem> = $props();
</script>

<CommandLinkItem {...props} />
