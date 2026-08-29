<script lang="ts" module>
	export * from '#lib/shadcn/ui/kbd/kbd-group.svelte';
</script>

<script lang="ts">
	import KbdGroup from '#lib/shadcn/ui/kbd/kbd-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof KbdGroup> = $props();
</script>

<KbdGroup {...props} />
