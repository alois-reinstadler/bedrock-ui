<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-prev-button.svelte';
</script>

<script lang="ts">
	import RangeCalendarPrevButton from '#lib/shadcn/ui/range-calendar/range-calendar-prev-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarPrevButton> = $props();
</script>

<RangeCalendarPrevButton {...props} />
