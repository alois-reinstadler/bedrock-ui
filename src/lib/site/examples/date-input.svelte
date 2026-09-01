<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import { DateInput } from '#lib/bedrock/ui/date-input';
	let value = $state(new CalendarDate(2026, 9, 1));
</script>

<DateInput bind:value clearable class="max-w-64" />
