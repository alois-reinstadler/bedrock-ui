<script lang="ts">
	import { CalendarDateTime } from '@internationalized/date';
	import { DateTimeInput } from '#lib/bedrock/ui/date-time-input';
	let value = $state(new CalendarDateTime(2026, 9, 1, 14, 30));
</script>

<DateTimeInput bind:value clearable class="max-w-sm" />
