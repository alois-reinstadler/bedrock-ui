<script lang="ts">
	import { CalendarDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { Calendar } from '#lib/bedrock/ui/calendar';

	let value = $state<DateValue | undefined>(new CalendarDate(2026, 9, 3));

	import { Button } from '#lib/bedrock/ui/button';
	let confirmed = $state('');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Book a workshop day</h3>
		<p class="text-sm text-muted-foreground">
			Choose a date before confirming a reservation; the selected day stays visible in the booking
			summary.
		</p>
	</header>

	<div class="flex flex-col items-start gap-2">
		<Calendar
			type="single"
			{value}
			onValueChange={(next) => (value = next)}
			class="rounded-lg border"
		/>
		{#if value}
			<p class="text-sm text-muted-foreground">
				Workshop day: {value.toDate(getLocalTimeZone()).toDateString()}
			</p>
		{/if}
	</div>

	<Button
		disabled={!value}
		onclick={() => (confirmed = `Workshop reserved for ${value?.toString()} in this demo.`)}
		>Reserve selected day</Button
	>
	<p role="status" class="text-sm">{confirmed}</p>
</section>
