<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import { DateRangeInput, type DateRangeInputValue } from '#lib/bedrock/ui/date-range-input';
	import { Button } from '#lib/bedrock/ui/button';
	let value = $state<DateRangeInputValue | undefined>({
		start: new CalendarDate(2026, 9, 1),
		end: new CalendarDate(2026, 9, 7)
	});
	let status = $state('');
	const presets = [
		{
			label: 'First week of September',
			range: () => ({ start: new CalendarDate(2026, 9, 1), end: new CalendarDate(2026, 9, 7) })
		}
	];
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Choose a reporting period</h3>
		<p class="text-sm text-muted-foreground">
			A date range defines an inclusive report window; a preset offers a useful shortcut.
		</p>
	</header>
	<div class="space-y-4 rounded-xl border bg-card p-5">
		<fieldset class="space-y-2">
			<legend class="mb-2 text-sm font-medium">Activity report dates</legend><DateRangeInput
				bind:value
				{presets}
				numberOfMonths={1}
				class="max-w-md"
			/>
		</fieldset>
		<p class="text-sm text-muted-foreground">Includes activity on both the start and end date.</p>
		<Button
			disabled={!value?.start || !value?.end}
			onclick={() =>
				(status = `Local report prepared for ${value?.start?.toString()} through ${value?.end?.toString()}.`)}
			>Prepare report</Button
		>
		<p role="status" class="text-sm">{status}</p>
	</div>
</section>
