<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import { DateInput } from '#lib/bedrock/ui/date-input';
	let value = $state(new CalendarDate(2026, 9, 1));
</script>

<div class="space-y-4">
	<fieldset>
		<legend class="mb-2 text-xs text-muted-foreground">Default · Editable</legend>

		<DateInput bind:value clearable class="max-w-64" />
	</fieldset>
	<fieldset>
		<legend class="mb-2 text-xs text-muted-foreground">Disabled</legend><DateInput
			{value}
			disabled
			class="max-w-sm"
		/>
	</fieldset>
</div>
