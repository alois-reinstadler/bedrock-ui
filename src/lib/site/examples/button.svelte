<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	let content = $state('The prototype is ready for a review on Thursday.');
	let status = $state('');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Publish a project update</h3>
		<p class="text-sm text-muted-foreground">
			Use one primary action, a quieter draft action, and a disabled action with an explanation.
		</p>
	</header>
	<form
		class="space-y-4 rounded-xl border bg-card p-5"
		onsubmit={(event) => {
			event.preventDefault();
			status = 'Update published to the local project feed.';
		}}
	>
		<label class="block space-y-2"
			><span class="text-sm font-medium">Team update</span><Textarea
				value={content}
				oninput={(event) => (content = event.currentTarget.value)}
				required
			/></label
		>
		<div class="flex flex-wrap items-center gap-2">
			<Button type="submit" disabled={!content.trim()}>Publish update</Button><Button
				type="button"
				variant="outline"
				onclick={() => (status = 'Draft saved locally for this example.')}>Save draft</Button
			><Button
				type="button"
				variant="ghost"
				onclick={() => {
					content = '';
					status = 'Draft cleared.';
				}}>Clear</Button
			>
		</div>
		<p class="text-xs text-muted-foreground">
			Write an update before publishing. This demo does not send notifications.
		</p>
		<p role="status" class="text-sm">{status}</p>
	</form>
</section>
