<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-grid-head.svelte';
</script>

<script lang="ts">
	import CalendarGridHead from '#lib/shadcn/ui/calendar/calendar-grid-head.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarGridHead> = $props();
</script>

<CalendarGridHead {...props} />
