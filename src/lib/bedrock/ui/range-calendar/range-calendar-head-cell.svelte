<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-head-cell.svelte';
</script>

<script lang="ts">
	import RangeCalendarHeadCell from '#lib/shadcn/ui/range-calendar/range-calendar-head-cell.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarHeadCell> = $props();
</script>

<RangeCalendarHeadCell {...props} />
