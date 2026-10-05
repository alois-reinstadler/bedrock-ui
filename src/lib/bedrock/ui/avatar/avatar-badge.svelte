<script lang="ts" module>
	export * from '#lib/shadcn/ui/avatar/avatar-badge.svelte';
</script>

<script lang="ts">
	import AvatarBadge from '#lib/shadcn/ui/avatar/avatar-badge.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof AvatarBadge> = $props();
</script>

<AvatarBadge bind:ref {...props} />
