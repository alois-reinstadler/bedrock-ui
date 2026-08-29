<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-month.svelte';
</script>

<script lang="ts">
	import RangeCalendarMonth from '#lib/shadcn/ui/range-calendar/range-calendar-month.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarMonth> = $props();
</script>

<RangeCalendarMonth {...props} />
