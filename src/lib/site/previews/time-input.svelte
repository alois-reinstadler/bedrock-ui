<script lang="ts">
	import { Time } from '@internationalized/date';
	import { TimeInput } from '#lib/bedrock/ui/time-input';
	let value = $state(new Time(14, 30));
</script>

<TimeInput bind:value locale="en-GB" aria-label="Time preview" hourCycle={24} class="max-w-52" />

<TimeInput
	value={new Time(9, 0)}
	disabled
	locale="en-GB"
	hourCycle={24}
	aria-label="Disabled time preview"
	class="mt-4 max-w-52"
/>
