<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import DateInput from './date-input.svelte';
	let value = $state(new CalendarDate(2026, 9, 1));
</script>

<DateInput bind:value min={new CalendarDate(2026, 9, 2)} />
