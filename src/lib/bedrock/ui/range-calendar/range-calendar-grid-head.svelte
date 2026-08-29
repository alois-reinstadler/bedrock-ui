<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-grid-head.svelte';
</script>

<script lang="ts">
	import RangeCalendarGridHead from '#lib/shadcn/ui/range-calendar/range-calendar-grid-head.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarGridHead> = $props();
</script>

<RangeCalendarGridHead {...props} />
