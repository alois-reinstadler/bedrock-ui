<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-caption.svelte';
</script>

<script lang="ts">
	import RangeCalendarCaption from '#lib/shadcn/ui/range-calendar/range-calendar-caption.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarCaption> = $props();
</script>

<RangeCalendarCaption {...props} />
