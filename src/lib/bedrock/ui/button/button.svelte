<script lang="ts" module>
	export * from '#lib/shadcn/ui/button/button.svelte';
</script>

<script lang="ts">
	import Button from '#lib/shadcn/ui/button/button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Button> = $props();
</script>

<Button {...props} />
