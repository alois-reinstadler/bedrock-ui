<script lang="ts">
	import { CalendarDateTime } from '@internationalized/date';
	import { DateTimeInput } from '#lib/bedrock/ui/date-time-input';
	import { Button } from '#lib/bedrock/ui/button';
	let value = $state<CalendarDateTime | undefined>(new CalendarDateTime(2026, 9, 18, 10, 30));
	let saved = $state('');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Schedule a team review</h3>
		<p class="text-sm text-muted-foreground">
			Explain the time zone beside the field; this example uses a local wall-clock time, not an
			instant.
		</p>
	</header>
	<form
		class="space-y-4 rounded-xl border bg-card p-5"
		onsubmit={(event) => {
			event.preventDefault();
			saved = value ? `Review scheduled for ${value.toString()}.` : 'Choose a date before saving.';
		}}
	>
		<fieldset class="space-y-2">
			<legend class="mb-2 text-sm font-medium">Review date and time</legend><DateTimeInput
				bind:value
				clearable
				class="max-w-sm"
			/>
		</fieldset>
		<p class="text-sm text-muted-foreground">
			Times are entered in the workspace’s local time zone. Resolve the zone on your server before
			scheduling.
		</p>
		<Button type="submit" disabled={!value}>Save review</Button>
		<p role="status" class="text-sm">{saved}</p>
	</form>
</section>
