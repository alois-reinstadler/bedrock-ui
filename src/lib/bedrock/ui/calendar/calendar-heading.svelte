<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-heading.svelte';
</script>

<script lang="ts">
	import CalendarHeading from '#lib/shadcn/ui/calendar/calendar-heading.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarHeading> = $props();
</script>

<CalendarHeading {...props} />
