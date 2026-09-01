<script lang="ts">
	import { CalendarDateTime } from '@internationalized/date';
	import DateTimeInput from './date-time-input.svelte';
	let value = $state(new CalendarDateTime(2026, 9, 1, 14, 30));
</script>

<DateTimeInput bind:value />
