<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-day.svelte';
</script>

<script lang="ts">
	import RangeCalendarDay from '#lib/shadcn/ui/range-calendar/range-calendar-day.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarDay> = $props();
</script>

<RangeCalendarDay {...props} />
