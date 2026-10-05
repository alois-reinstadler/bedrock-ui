<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Time } from '@internationalized/date';
	import { TimeInput } from '#lib/bedrock/ui/time-input';
	let value = $state(new Time(14, 30));
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Schedule a consultation</h3>
		<p class="text-sm text-muted-foreground">
			Set the appointment time with segmented keyboard input. The time zone belongs beside the
			field, not hidden in the value.
		</p>
	</div>

	<Card.Root class="block max-w-md gap-0 space-y-3 p-5">
		<p id="appointment-time-label" class="text-sm font-medium">Appointment time</p>
		<TimeInput
			bind:value
			locale="en-GB"
			hourCycle={24}
			aria-labelledby="appointment-time-label"
			class="max-w-52"
		/>
		<p class="text-sm text-muted-foreground">Europe/Vienna · 30-minute consultation</p>
		<p role="status" class="text-sm">Selected time: {value.toString()}</p>
	</Card.Root>
</section>
