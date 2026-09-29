<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Button } from '#lib/bedrock/ui/button';
	let fail = $state(false);
	let result = $state('');
	let revision = $state(0);
	let recommendation = $state('small');
	async function save(value: string) {
		await new Promise((resolve) => setTimeout(resolve, 100));
		if (fail) {
			fail = false;
			throw new Error('Demo failure');
		}
		result = value;
	}
</script>

<section data-demo="chat-decisions" class="mx-auto w-full max-w-md space-y-5">
	<p class="text-sm text-muted-foreground">
		Ask a question or request a decision within a conversation. No external actions run in this
		demo.
	</p>
	{#key revision}
		<Chat.Approval
			title="Publish the release notes?"
			description="The draft is ready. Publish it to your team’s release feed?"
			onDecide={(decision) => save(`Decision: ${decision}`)}
		/>
		<Chat.Questions
			questions={[
				{
					id: 'audience',
					label: 'Who is this release for?',
					options: [
						{ value: 'team', label: 'Our team' },
						{ value: 'customers', label: 'Customers' }
					],
					allowCustom: true
				},
				{
					id: 'tone',
					label: 'Which tone should we use?',
					options: [
						{ value: 'brief', label: 'Brief' },
						{ value: 'friendly', label: 'Friendly' }
					],
					required: false
				}
			]}
			onSubmit={(answers) => save(`Answers: ${JSON.stringify(answers)}`)}
		/>
		<Chat.Recommendation
			title="Choose a rollout"
			bind:value={recommendation}
			options={[
				{
					id: 'small',
					title: 'Start with a small group',
					description: 'Release to the pilot team first.',
					confidence: 'Supported by pilot feedback'
				},
				{
					id: 'all',
					title: 'Release to everyone',
					description: 'Make the feature available to every team.',
					confidence: 'Requires further review'
				}
			]}
			onAccept={(option) => save(`Accepted: ${option.id}`)}
			onDismiss={() => save('Recommendation dismissed')}
		/>
	{/key}
	<div class="flex flex-wrap gap-2">
		<Button
			size="sm"
			variant="ghost"
			onclick={() => {
				fail = true;
			}}>Fail next decision</Button
		><Button
			size="sm"
			variant="ghost"
			onclick={() => {
				revision++;
				result = '';
				fail = false;
				recommendation = 'small';
			}}>Reset decisions</Button
		>
	</div>
	<output class="block text-sm break-words">{result}</output>
	<p class="text-sm text-muted-foreground">
		Callbacks may be async. Rejections retain choices for retry; successful decisions lock against
		duplicate submission. Key each instance by its request ID when displaying a new request.
		Confidence text is supplied by your app.
	</p>
</section>
