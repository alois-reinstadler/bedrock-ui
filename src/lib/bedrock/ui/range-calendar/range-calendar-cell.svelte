<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-cell.svelte';
</script>

<script lang="ts">
	import RangeCalendarCell from '#lib/shadcn/ui/range-calendar/range-calendar-cell.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarCell> = $props();
</script>

<RangeCalendarCell {...props} />
