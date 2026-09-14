<script lang="ts">
	import * as InputOTP from '#lib/bedrock/ui/input-otp';

	let value = $state('');

	import { Button } from '#lib/bedrock/ui/button';
	let attempted = $state(false);
	let resent = $state(false);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Confirm a new device</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Keep the destination and recovery action visible. This local demonstration accepts 123456.
		</p>
	</header>
	<p class="text-sm">Enter the six-digit code sent to a•••@example.com.</p>

	<InputOTP.Root
		maxlength={6}
		aria-label="Six-digit verification code"
		{value}
		onValueChange={(next) => (value = next)}
	>
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
	<div class="flex flex-wrap gap-2">
		<Button disabled={value.length !== 6} onclick={() => (attempted = true)}>Verify device</Button
		><Button
			variant="ghost"
			onclick={() => {
				resent = true;
				attempted = false;
				value = '';
			}}>Send another code</Button
		>
	</div>
	<p role="status" class="text-sm">
		{attempted
			? value === '123456'
				? 'Device verified in this demonstration.'
				: 'That code did not match. Try 123456.'
			: resent
				? 'A new sample code is ready: 123456.'
				: ''}
	</p>
</section>
