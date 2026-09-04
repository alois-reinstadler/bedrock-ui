<script lang="ts">
	import * as InputOTP from '#lib/bedrock/ui/input-otp';

	let value = $state('');
</script>

<InputOTP.Root maxlength={6} {value} onValueChange={(next) => (value = next)}>
	{#snippet children({ cells })}
		<InputOTP.Group>
			{#each cells.slice(0, 3) as cell (cell)}<InputOTP.Slot {cell} />{/each}
		</InputOTP.Group>
		<InputOTP.Separator />
		<InputOTP.Group>
			{#each cells.slice(3, 6) as cell (cell)}<InputOTP.Slot {cell} />{/each}
		</InputOTP.Group>
	{/snippet}
</InputOTP.Root>
