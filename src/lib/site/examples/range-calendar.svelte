<script lang="ts">
	import { CalendarDate, type DateValue } from '@internationalized/date';
	import { RangeCalendar } from '#lib/bedrock/ui/range-calendar';

	let value = $state<{ start: DateValue | undefined; end: DateValue | undefined }>({
		start: new CalendarDate(2026, 9, 7),
		end: new CalendarDate(2026, 9, 11)
	});
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Book a team retreat</h3>
		<p class="text-sm text-muted-foreground">
			Choose arrival and departure together so the booking summary always reflects a complete stay.
		</p>
	</div>

	<RangeCalendar {value} onValueChange={(next) => (value = next)} class="rounded-lg border" />

	<p role="status" class="text-sm">
		{value.start?.toString() ?? 'Choose arrival'} → {value.end?.toString() ?? 'Choose departure'} · Mountain
		House
	</p>
</section>
