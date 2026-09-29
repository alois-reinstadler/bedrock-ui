<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Button } from '#lib/bedrock/ui/button';
	let value = $state('');
	let result = $state('');
	let fail = $state(false);
	const contexts: Chat.ChatContext[] = [
		{ id: 'release', label: 'Release notes', description: 'Product changes for this month' },
		{ id: 'roadmap', label: 'Roadmap', description: 'Upcoming milestones' },
		{ id: 'private', label: 'Private records', disabled: true }
	];
	const commands: Chat.ChatCommand[] = [
		{ id: 'summarize', label: 'Summarize', description: 'Summarize the selected context' },
		{ id: 'compare', label: 'Compare', description: 'Compare two sources' }
	];
</script>

<section data-demo="chat-context" class="w-full max-w-xl space-y-4">
	<p class="text-sm text-muted-foreground">
		Type @ to choose sources or / for commands. Use arrow keys, Enter to select, and Escape to
		dismiss. Selected chips are sent as structured context; choosing a command never sends
		automatically.
	</p>
	<Chat.Composer
		bind:value
		{contexts}
		{commands}
		onSend={async (message, submission) => {
			await new Promise((resolve) => setTimeout(resolve, 50));
			if (fail) {
				fail = false;
				throw new Error('Demo send failure');
			}
			result = JSON.stringify({
				message,
				context: submission.context?.map((item) => item.id) ?? [],
				command: submission.command?.id ?? null
			});
		}}
	/>
	<Button
		size="sm"
		variant="ghost"
		onclick={() => {
			fail = true;
		}}>Fail next context send</Button
	>
	<output class="block text-sm break-all">{result}</output>
</section>
