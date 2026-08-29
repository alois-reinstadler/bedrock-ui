<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-next-button.svelte';
</script>

<script lang="ts">
	import RangeCalendarNextButton from '#lib/shadcn/ui/range-calendar/range-calendar-next-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarNextButton> = $props();
</script>

<RangeCalendarNextButton {...props} />
