<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-next-button.svelte';
</script>

<script lang="ts">
	import CalendarNextButton from '#lib/shadcn/ui/calendar/calendar-next-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarNextButton> = $props();
</script>

<CalendarNextButton {...props} />
