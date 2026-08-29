<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-header.svelte';
</script>

<script lang="ts">
	import RangeCalendarHeader from '#lib/shadcn/ui/range-calendar/range-calendar-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarHeader> = $props();
</script>

<RangeCalendarHeader {...props} />
