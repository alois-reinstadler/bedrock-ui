<script lang="ts" module>
	export * from '#lib/shadcn/ui/avatar/avatar-group.svelte';
</script>

<script lang="ts">
	import AvatarGroup from '#lib/shadcn/ui/avatar/avatar-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AvatarGroup> = $props();
</script>

<AvatarGroup {...props} />
