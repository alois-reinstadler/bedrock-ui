<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import { DateRangeInput, type DateRangeInputValue } from '#lib/bedrock/ui/date-range-input';
	let value = $state<DateRangeInputValue>({
		start: new CalendarDate(2026, 9, 1),
		end: new CalendarDate(2026, 9, 5)
	});
	const presets = [
		{
			label: 'This week',
			range: () => ({ start: new CalendarDate(2026, 9, 1), end: new CalendarDate(2026, 9, 7) })
		}
	];
</script>

<DateRangeInput bind:value {presets} class="max-w-md" />
