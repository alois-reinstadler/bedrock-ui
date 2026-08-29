<script lang="ts" module>
	export * from '#lib/shadcn/ui/avatar/avatar.svelte';
</script>

<script lang="ts">
	import Avatar from '#lib/shadcn/ui/avatar/avatar.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Avatar> = $props();
</script>

<Avatar {...props} />
