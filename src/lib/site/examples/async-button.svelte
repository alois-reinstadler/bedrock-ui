<script lang="ts">
	import { AsyncButton } from '#lib/bedrock/ui/async-button';

	function save(): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, 1200));
	}

	function sync(): Promise<void> {
		return new Promise((_, reject) => setTimeout(() => reject(new Error('Offline')), 1200));
	}
</script>

<div class="flex flex-wrap items-center gap-2">
	<AsyncButton action={save} pendingLabel="Saving…" successLabel="Saved">Save draft</AsyncButton>
	<AsyncButton variant="outline" action={sync} pendingLabel="Syncing…" errorLabel="Sync failed">
		Sync now
	</AsyncButton>
</div>
