<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-grid-body.svelte';
</script>

<script lang="ts">
	import RangeCalendarGridBody from '#lib/shadcn/ui/range-calendar/range-calendar-grid-body.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarGridBody> = $props();
</script>

<RangeCalendarGridBody {...props} />
