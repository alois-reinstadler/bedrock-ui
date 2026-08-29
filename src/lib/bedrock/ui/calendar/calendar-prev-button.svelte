<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-prev-button.svelte';
</script>

<script lang="ts">
	import CalendarPrevButton from '#lib/shadcn/ui/calendar/calendar-prev-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarPrevButton> = $props();
</script>

<CalendarPrevButton {...props} />
