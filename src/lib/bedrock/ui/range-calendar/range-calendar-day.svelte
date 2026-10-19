<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-day.svelte';
</script>

<script lang="ts">
	import RangeCalendarDay from '#lib/shadcn/ui/range-calendar/range-calendar-day.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof RangeCalendarDay> = $props();
</script>

<RangeCalendarDay bind:ref {...props} />
