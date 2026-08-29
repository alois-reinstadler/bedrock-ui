<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar.svelte';
</script>

<script lang="ts">
	import Calendar from '#lib/shadcn/ui/calendar/calendar.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Calendar> = $props();
</script>

<Calendar {...props} />
