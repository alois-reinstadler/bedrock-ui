<script lang="ts">
	import * as Message from '#lib/bedrock/ui/message';
	import * as Bubble from '#lib/bedrock/ui/bubble';
	import * as Avatar from '#lib/bedrock/ui/avatar';
	import { Button } from '#lib/bedrock/ui/button';
	let replied = $state(false);
</script>

<section class="w-full max-w-lg space-y-6" aria-label="Message example">
	<Message.Group>
		<Message.Root
			><Message.Avatar
				><Avatar.Root><Avatar.Fallback>AL</Avatar.Fallback></Avatar.Root></Message.Avatar
			><Message.Content
				><Message.Header>Ari Lane</Message.Header><Bubble.Root variant="muted"
					><Bubble.Content>Could you review the release notes?</Bubble.Content></Bubble.Root
				><Message.Footer><span>09:41</span></Message.Footer></Message.Content
			></Message.Root
		>
		<Message.Root
			><Message.Avatar aria-hidden="true" /><Message.Content
				><Bubble.Root variant="muted"
					><Bubble.Content>The accessibility updates are included.</Bubble.Content></Bubble.Root
				><Message.Footer
					><Button size="xs" variant="ghost" onclick={() => (replied = true)} disabled={replied}
						>Reply to Ari</Button
					></Message.Footer
				></Message.Content
			></Message.Root
		>
	</Message.Group>
	{#if replied}<Message.Root align="end"
			><Message.Content
				><Message.Header>You</Message.Header><Bubble.Root
					><Bubble.Content>I will review them this morning.</Bubble.Content></Bubble.Root
				><Message.Footer>Sent just now</Message.Footer></Message.Content
			></Message.Root
		>{/if}
	<p role="status" class="min-h-5 text-sm text-muted-foreground">
		{replied ? 'Your reply was sent.' : 'Reply to continue the conversation.'}
	</p>
</section>
