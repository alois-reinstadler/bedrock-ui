<script lang="ts">
	import * as Alert from '#lib/bedrock/ui/alert';
	import { Button } from '#lib/bedrock/ui/button';
	let recovered = $state(false);
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Recover a failed export</h3>
		<p class="text-sm text-muted-foreground">
			Keep the failure beside its recovery action and announce the result without replacing the
			surrounding page.
		</p>
	</header>
	<div class="space-y-4 rounded-xl border bg-card p-5">
		<div>
			<p class="font-medium">September activity report</p>
			<p class="text-sm text-muted-foreground">128 entries · CSV export</p>
		</div>
		<Alert.Root variant={recovered ? 'default' : 'destructive'}
			><Alert.Title>{recovered ? 'Export ready' : 'Export interrupted'}</Alert.Title
			><Alert.Description
				>{recovered
					? 'The local demo report is ready. Your source entries were preserved.'
					: 'The connection ended before the export finished. Your entries are safe; retry the export.'}</Alert.Description
			></Alert.Root
		><Button variant="outline" onclick={() => (recovered = !recovered)}
			>{recovered ? 'Simulate another failure' : 'Retry export'}</Button
		>
	</div>
</section>
