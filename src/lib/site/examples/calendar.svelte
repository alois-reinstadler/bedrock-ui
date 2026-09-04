<script lang="ts">
	import { CalendarDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { Calendar } from '#lib/bedrock/ui/calendar';

	let value = $state<DateValue | undefined>(new CalendarDate(2026, 9, 3));
</script>

<div class="flex flex-col items-start gap-2">
	<Calendar type="single" {value} onValueChange={(next) => (value = next)} class="rounded-lg border" />
	{#if value}
		<p class="text-sm text-muted-foreground">
			Selected: {value.toDate(getLocalTimeZone()).toDateString()}
		</p>
	{/if}
</div>
