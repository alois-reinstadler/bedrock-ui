<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-nav.svelte';
</script>

<script lang="ts">
	import RangeCalendarNav from '#lib/shadcn/ui/range-calendar/range-calendar-nav.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarNav> = $props();
</script>

<RangeCalendarNav {...props} />
