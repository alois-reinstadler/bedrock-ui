<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';

	const models: Chat.ChatModelOption[] = [
		{ value: 'atlas-pro', label: 'Atlas Pro', provider: 'Acme', description: 'For complex work' },
		{
			value: 'atlas-mini',
			label: 'Atlas Mini',
			provider: 'Acme',
			description: 'For quick questions'
		},
		{
			value: 'local-coder',
			label: 'Local Coder',
			provider: 'Local',
			description: 'Runs on your device'
		},
		{ value: 'legacy-atlas', label: 'Atlas Classic', provider: 'Acme', group: 'Legacy models' }
	];
	let model = $state('atlas-pro');
	let reasoning = $state('high');
	let serviceTier = $state('standard');
	let nextId = 1;
	let messages = $state<{ id: number; text: string; files: File[]; settings: string }[]>([]);
	async function send(text: string, submission: Chat.ChatComposerSubmission) {
		// Upload submission.files using your transport (for example, FormData).
		// Throw on failure to keep the draft and files available for retry.
		messages = [
			...messages,
			{
				id: nextId++,
				text,
				files: submission.files,
				settings: [
					models.find((entry) => entry.value === submission.model)?.label,
					submission.reasoning,
					submission.serviceTier
				]
					.filter(Boolean)
					.join(' · ')
			}
		];
	}
</script>

<section class="w-full max-w-2xl space-y-4">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Chat with optional composer controls</h3>
		<p class="text-sm text-muted-foreground">
			Choose a model and reasoning level, then attach or drop up to four images, PDFs, or text files
			(5 MB each). Messages and files stay in this local demo.
		</p>
	</header>
	<Chat.Root class="h-96 min-w-0 rounded-lg border">
		<Chat.MessageList>
			<Chat.Message role="assistant"
				><Chat.MessageBubble
					>What would you like to work on? You can also send files without a message.</Chat.MessageBubble
				></Chat.Message
			>
			{#each messages as message (message.id)}
				<Chat.Message role="user">
					{#if message.text}<Chat.MessageBubble>{message.text}</Chat.MessageBubble>{/if}
					{#if message.files.length}<Chat.Attachments
							>{#each message.files as file (file)}<Chat.Attachment
									name={file.name}
									size={file.size}
								/>{/each}</Chat.Attachments
						>{/if}
					<Chat.MessageMetadata>{message.settings}</Chat.MessageMetadata>
				</Chat.Message>
			{/each}
		</Chat.MessageList>
		<div class="p-3 pt-0">
			<Chat.Composer
				{models}
				bind:model
				favoriteModels={['atlas-pro']}
				reasoningOptions={Chat.defaultReasoningOptions}
				bind:reasoning
				bind:serviceTier
				serviceTiers={[
					{ value: 'standard', label: 'Standard', default: true },
					{ value: 'fast', label: 'Fast', description: 'Prioritize response speed' }
				]}
				attachments
				multiple
				accept="image/*,.pdf,.txt"
				maxFiles={4}
				maxFileSize={5 * 1024 * 1024}
				onSend={send}
			/>
		</div>
	</Chat.Root>
	<p class="text-xs text-muted-foreground">
		Model names are illustrative. Omit models, reasoningOptions, and attachments for the simple
		composer shown in the preview. Your app supplies available options and handles uploads.
	</p>
</section>
