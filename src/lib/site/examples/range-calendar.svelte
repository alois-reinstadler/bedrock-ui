<script lang="ts">
	import { CalendarDate, type DateValue } from '@internationalized/date';
	import { RangeCalendar } from '#lib/bedrock/ui/range-calendar';

	let value = $state<{ start: DateValue | undefined; end: DateValue | undefined }>({
		start: new CalendarDate(2026, 9, 7),
		end: new CalendarDate(2026, 9, 11)
	});
</script>

<RangeCalendar {value} onValueChange={(next) => (value = next)} class="rounded-lg border" />
