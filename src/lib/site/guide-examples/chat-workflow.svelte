<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Button } from '#lib/bedrock/ui/button';
	let layout = $state<'list' | 'chips'>('list');
	let steps = $state<Chat.ChatActivityStep[]>([
		{
			id: 'search',
			title: 'Find release notes',
			kind: 'tool',
			status: 'complete',
			duration: '1.2s',
			detail: 'Found two documents.'
		},
		{
			id: 'review',
			title: 'Review proposed changes',
			kind: 'task',
			status: 'running',
			progress: 60,
			children: [{ id: 'checks', label: 'Checks passed', detail: '6 / 10' }]
		},
		{
			id: 'summary',
			title: 'Prepare summary',
			kind: 'reasoning',
			status: 'pending',
			detail: 'Waiting for the review.'
		}
	]);
	let selected = $state(['heading', 'copy']);
	let applied = $state('');
	let fail = $state(false);
	let value = $state('');
	const changes: Chat.ChatChange[] = [
		{
			id: 'heading',
			title: 'Update heading',
			before: '## Updates',
			after: '## September release',
			language: 'markdown'
		},
		{
			id: 'copy',
			title: 'Clarify description',
			before: 'New chat things.',
			after: 'Review transcripts and retry interrupted messages.',
			language: 'plaintext'
		}
	];
</script>

<section data-demo="chat-workflow" class="w-full max-w-xl space-y-4">
	<p class="text-sm text-muted-foreground">
		Tool calls, tasks, and public progress summaries share one activity surface. Expand a row for
		details.
	</p>
	<div class="flex flex-wrap gap-2">
		<Button
			size="sm"
			variant="outline"
			onclick={() => {
				layout = layout === 'list' ? 'chips' : 'list';
			}}>Toggle activity layout</Button
		>
		<Button
			size="sm"
			variant="outline"
			onclick={() => {
				steps = steps.map((step) =>
					step.id === 'review'
						? { ...step, status: 'error', detail: 'A check failed. Review the output.' }
						: step
				);
			}}>Fail review task</Button
		>
		<Button
			size="sm"
			variant="outline"
			onclick={() => {
				steps = steps.map((step) => ({ ...step, status: 'complete', progress: 100 }));
			}}>Complete tasks</Button
		>
	</div>
	<Chat.Activity {steps} {layout} />
	<Button
		size="sm"
		variant="outline"
		onclick={() => {
			fail = true;
		}}>Fail next change apply</Button
	>
	<Chat.ChangeReview
		{changes}
		bind:selected
		onApply={async (picked) => {
			await new Promise((resolve) => setTimeout(resolve, 100));
			if (fail) {
				fail = false;
				throw new Error('Demo failure');
			}
			applied = `Applied: ${picked.map((change) => change.id).join(', ')}`;
		}}
	/>
	<output class="block text-sm">{applied}</output>
	<Chat.SelectionActions
		onAction={(action, text) => {
			value = `${action}: ${text}`;
		}}
	>
		<p>
			The new chat controls let you review a transcript before sending it. Interrupted messages can
			be retried without losing the draft.
		</p>
	</Chat.SelectionActions>
	<Chat.Composer bind:value onSend={() => {}} />
	<p class="text-sm text-muted-foreground">
		The app computes review units and applies selected changes. Selection actions pass the chosen
		text into a draft; they do not rewrite or send it automatically. Use keyed review IDs for new
		proposals.
	</p>
</section>
