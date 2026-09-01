<script lang="ts">
	import { Time } from '@internationalized/date';
	import TimeInput from './time-input.svelte';
	let value = $state(new Time(14, 30));
</script>

<TimeInput bind:value hourCycle={12} disabled />
