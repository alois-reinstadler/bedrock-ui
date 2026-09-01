<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import DateRangeInput from './date-range-input.svelte';
	let value = $state({ start: new CalendarDate(2026, 9, 1), end: new CalendarDate(2026, 9, 2) });
	let open = $state(false);
	const presets = [
		{
			label: 'Next week',
			range: () => ({ start: new CalendarDate(2026, 9, 7), end: new CalendarDate(2026, 9, 13) })
		}
	];
</script>

<DateRangeInput bind:value bind:open {presets} />
<output>{value.start.toString()}–{value.end.toString()}</output>
