<script lang="ts">
	import { AuthenticationPanel } from '#lib/bedrock/blocks/authentication-panel/index.js';
	import { Switch } from '#lib/bedrock/ui/switch';
	let fail = $state(false);
	async function authenticate() {
		await new Promise((resolve) => setTimeout(resolve, 450));
		if (fail) throw new Error('Demo failure');
	}
</script>

<p class="text-sm text-muted-foreground">
	Demo only. Use fictional credentials; nothing is sent or stored.
</p>
<AuthenticationPanel onSubmit={authenticate} />
<div class="flex items-center justify-between gap-4 text-sm">
	<span>Simulate a server error</span><Switch
		bind:checked={fail}
		aria-label="Simulate a server error"
	/>
</div>
