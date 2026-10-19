<script lang="ts" module>
	export * from '#lib/shadcn/ui/avatar/avatar-image.svelte';
</script>

<script lang="ts">
	import AvatarImage from '#lib/shadcn/ui/avatar/avatar-image.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof AvatarImage> = $props();
</script>

<AvatarImage bind:ref {...props} />
