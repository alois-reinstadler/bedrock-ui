<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-nav.svelte';
</script>

<script lang="ts">
	import RangeCalendarNav from '#lib/shadcn/ui/range-calendar/range-calendar-nav.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof RangeCalendarNav> = $props();
</script>

<RangeCalendarNav bind:ref {...props} />
