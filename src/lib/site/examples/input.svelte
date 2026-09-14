<script lang="ts">
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import { Button } from '#lib/bedrock/ui/button';
	let email = $state('');
	let subscribed = $state(false);
</script>

<section class="w-full max-w-2xl space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Monthly product digest</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Use a persistent label and native email validation; show confirmation without replacing the
			form.
		</p>
	</header>
	<form
		class="space-y-3"
		onsubmit={(event) => {
			event.preventDefault();
			subscribed = true;
		}}
	>
		<Label for="digest-email">Work email</Label><Input
			id="digest-email"
			type="email"
			name="email"
			required
			autocomplete="email"
			value={email}
			oninput={(event) => {
				email = event.currentTarget.value;
				subscribed = false;
			}}
			aria-describedby="digest-help"
			placeholder="alex@example.com"
		/>
		<p id="digest-help" class="text-sm text-muted-foreground">
			One product update each month. Unsubscribe at any time.
		</p>
		<Button type="submit">Subscribe to the digest</Button>
		<p role="status" class="text-sm">
			{subscribed ? `Sample subscription saved for ${email}.` : ''}
		</p>
	</form>
</section>
