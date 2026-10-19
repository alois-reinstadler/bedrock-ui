<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-heading.svelte';
</script>

<script lang="ts">
	import RangeCalendarHeading from '#lib/shadcn/ui/range-calendar/range-calendar-heading.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof RangeCalendarHeading> = $props();
</script>

<RangeCalendarHeading bind:ref {...props} />
