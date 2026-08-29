<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar.svelte';
</script>

<script lang="ts">
	import RangeCalendar from '#lib/shadcn/ui/range-calendar/range-calendar.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendar> = $props();
</script>

<RangeCalendar {...props} />
