<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import { DateInput } from '#lib/bedrock/ui/date-input';
	import { Button } from '#lib/bedrock/ui/button';
	let value = $state<CalendarDate | undefined>(new CalendarDate(2026, 9, 18));
	let saved = $state('');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Set a review deadline</h3>
		<p class="text-sm text-muted-foreground">
			A date without a time is appropriate when the deadline applies to the whole working day.
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
			<legend class="mb-2 text-sm font-medium">Review deadline</legend><DateInput
				bind:value
				clearable
				class="max-w-sm"
			/>
		</fieldset>
		<p class="text-sm text-muted-foreground">
			Your team can submit feedback through the end of this date.
		</p>
		<Button type="submit" disabled={!value}>Save review</Button>
		<p role="status" class="text-sm">{saved}</p>
	</form>
</section>
