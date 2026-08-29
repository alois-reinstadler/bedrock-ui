<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-grid-row.svelte';
</script>

<script lang="ts">
	import RangeCalendarGridRow from '#lib/shadcn/ui/range-calendar/range-calendar-grid-row.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarGridRow> = $props();
</script>

<RangeCalendarGridRow {...props} />
