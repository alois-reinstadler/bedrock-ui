<script lang="ts">
	import { Time } from '@internationalized/date';
	import { TimeInput } from '#lib/bedrock/ui/time-input';
	let value = $state(new Time(14, 30));
</script>

<TimeInput bind:value locale="de-AT" hourCycle={24} class="max-w-52" />
