<script lang="ts">
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import { Label } from '#lib/bedrock/ui/label';
	import { Button } from '#lib/bedrock/ui/button';
	let message = $state('');
	let sent = $state(false);
</script>

<form
	class="max-w-md space-y-3 rounded-xl border p-5"
	onsubmit={(event) => {
		event.preventDefault();
		sent = true;
	}}
>
	<h3 class="font-medium">Contact support</h3>
	<p class="text-sm text-muted-foreground">
		Include what you expected and what happened. Never include passwords.
	</p>
	<Label for="support-message">How can we help?</Label><Textarea
		id="support-message"
		required
		minlength={20}
		maxlength={500}
		value={message}
		oninput={(event) => {
			message = event.currentTarget.value;
			sent = false;
		}}
		aria-describedby="support-limit"
		placeholder="I was updating our billing address when…"
	/>
	<p id="support-limit" class="text-xs text-muted-foreground">
		{message.length}/500 characters · At least 20 characters
	</p>
	<Button type="submit">Send sample request</Button>
	<p role="status" class="text-sm">
		{sent ? 'Sample request received. Nothing was sent to a server.' : ''}
	</p>
</form>
