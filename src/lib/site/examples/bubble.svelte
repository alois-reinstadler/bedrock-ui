<script lang="ts">
	import * as Bubble from '#lib/bedrock/ui/bubble';
	let liked = $state(false);
	let reply = $state('');
</script>

<section class="w-full max-w-lg space-y-6" aria-label="Bubble example">
	<Bubble.Root variant="muted"
		><Bubble.Content>The updated design is ready to review.</Bubble.Content><Bubble.Reactions
			><button
				type="button"
				aria-label="Like message"
				aria-pressed={liked}
				onclick={() => (liked = !liked)}
				class="rounded-full px-2 py-1 text-xs focus-visible:outline-2 focus-visible:outline-ring"
				>Like {liked ? 1 : 0}</button
			></Bubble.Reactions
		></Bubble.Root
	>
	<Bubble.Root variant="outline" align="end"
		><Bubble.Content
			>{#snippet child({ props })}<button
					{...props}
					type="button"
					onclick={() => (reply = 'Thanks, I will take a look.')}
					>Thanks, I will take a look.</button
				>{/snippet}</Bubble.Content
		></Bubble.Root
	>
	<p role="status" class="min-h-5 text-sm text-muted-foreground">
		{reply ? `Reply sent: ${reply}` : 'Select the suggested reply or react to the message.'}
	</p>
</section>
