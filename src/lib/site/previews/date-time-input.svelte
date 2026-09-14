<script lang="ts">
	import { CalendarDateTime } from '@internationalized/date';
	import { DateTimeInput } from '#lib/bedrock/ui/date-time-input';
	let value = $state(new CalendarDateTime(2026, 9, 1, 14, 30));
</script>

<div class="space-y-4">
	<fieldset>
		<legend class="mb-2 text-xs text-muted-foreground">Default · Editable</legend>

		<DateTimeInput bind:value clearable class="max-w-sm" />
	</fieldset>
	<fieldset>
		<legend class="mb-2 text-xs text-muted-foreground">Disabled</legend><DateTimeInput
			{value}
			disabled
			class="max-w-sm"
		/>
	</fieldset>
</div>
