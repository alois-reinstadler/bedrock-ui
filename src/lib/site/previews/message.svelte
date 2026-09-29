<script lang="ts">
	import * as Message from '#lib/bedrock/ui/message';
	import * as Bubble from '#lib/bedrock/ui/bubble';
	import * as Avatar from '#lib/bedrock/ui/avatar';
</script>

<div class="w-full max-w-lg space-y-5">
	<Message.Root
		><Message.Avatar aria-hidden="true"
			><Avatar.Root><Avatar.Fallback>AL</Avatar.Fallback></Avatar.Root></Message.Avatar
		><Message.Content
			><Message.Header>Ari Lane</Message.Header><Bubble.Root variant="muted"
				><Bubble.Content>Everything is ready for review.</Bubble.Content></Bubble.Root
			><Message.Footer>09:41</Message.Footer></Message.Content
		></Message.Root
	>
	<Message.Root align="end"
		><Message.Content
			><Message.Header>You</Message.Header><Bubble.Root
				><Bubble.Content>Looks good. Thank you!</Bubble.Content></Bubble.Root
			><Message.Footer>Delivered · 09:42</Message.Footer></Message.Content
		></Message.Root
	>
</div>
