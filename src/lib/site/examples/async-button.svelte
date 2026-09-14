<script lang="ts">
	import { AsyncButton } from '#lib/bedrock/ui/async-button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	let digest = $state(true);
	let attempt = $state(0);
	let saved = $state(false);
	async function save() {
		await new Promise((resolve) => setTimeout(resolve, 800));
		attempt += 1;
		if (attempt === 1) throw new Error('Connection interrupted');
		saved = true;
	}
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Save notification preferences</h3>
		<p class="text-sm text-muted-foreground">
			A simulated first failure teaches retry behavior while preserving the selected setting.
		</p>
	</header>
	<div class="space-y-4 rounded-xl border bg-card p-5">
		<label class="flex items-center gap-3"
			><Checkbox bind:checked={digest} />Weekly project digest</label
		>
		<p class="text-sm text-muted-foreground">
			The first save simulates a connection failure. Try again; your choice stays selected.
		</p>
		<AsyncButton
			action={save}
			pendingLabel="Saving preferences…"
			errorLabel="Retry save"
			successLabel="Preferences saved">Save preferences</AsyncButton
		>
		<p role="status" class="text-sm">
			{saved
				? digest
					? 'Weekly digest enabled in this demo.'
					: 'Weekly digest disabled in this demo.'
				: ''}
		</p>
	</div>
</section>
