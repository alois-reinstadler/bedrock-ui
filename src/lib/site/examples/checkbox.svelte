<script lang="ts">
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Button } from '#lib/bedrock/ui/button';
	let checked = $state(false);
	let saved = $state('');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Email delivery preferences</h3>
		<p class="text-sm text-muted-foreground">
			An optional preference starts unchecked and does not block the main form action.
		</p>
	</header>
	<form
		class="space-y-4 rounded-xl border bg-card p-5"
		onsubmit={(event) => {
			event.preventDefault();
			saved = checked ? 'You will receive a weekly summary.' : 'Weekly summaries are turned off.';
		}}
	>
		<fieldset class="space-y-3">
			<legend class="font-medium">Stay up to date</legend><label class="flex items-start gap-3"
				><Checkbox bind:checked /><span
					><span class="block text-sm font-medium">Send a weekly project summary</span><span
						class="text-sm text-muted-foreground"
						>A single email on Monday. Essential account emails are unaffected.</span
					></span
				></label
			>
		</fieldset>
		<Button type="submit">Save preferences</Button>
		<p role="status" class="text-sm">{saved}</p>
	</form>
</section>
