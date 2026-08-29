<script lang="ts" module>
	export * from '#lib/shadcn/ui/avatar/avatar-group-count.svelte';
</script>

<script lang="ts">
	import AvatarGroupCount from '#lib/shadcn/ui/avatar/avatar-group-count.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AvatarGroupCount> = $props();
</script>

<AvatarGroupCount {...props} />
