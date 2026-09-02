<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	import { streamText } from '#lib/bedrock/ui/chat';
	import { Markdown } from '#lib/bedrock/ui/markdown';
	import { Timestamp } from '#lib/bedrock/ui/timestamp';
	import type { CitationSource } from '#lib/bedrock/ui/citation';

	const chartImage =
		'data:image/svg+xml,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#e2e8f0"/><rect x="40" y="90" width="40" height="80" fill="#6366f1"/><rect x="100" y="60" width="40" height="110" fill="#6366f1"/><rect x="160" y="110" width="40" height="60" fill="#6366f1"/><rect x="220" y="30" width="40" height="140" fill="#6366f1"/></svg>'
		);

	const sources: Record<string, CitationSource> = {
		docs: { title: 'SvelteKit docs — load functions', url: 'https://svelte.dev/docs/kit/load' },
		rfc: { title: 'Internal RFC 42: caching strategy' }
	};

	const answerMarkdown = `The chart shows a spike in **week 4** — that lines up with the cache
invalidation bug. The fix is to key the load function by the session id [docs]:

\`\`\`ts
export async function load({ locals, depends }) {
	depends(\`session:\${locals.sessionId}\`);
	return { report: await loadReport(locals.sessionId) };
}
\`\`\`

The caching strategy itself stays as designed [rfc].`;

	const toolCalls: Chat.ChatToolCall[] = [
		{
			key: 'read',
			name: 'read_file',
			status: 'complete',
			target: 'src/routes/report/+page.server.ts',
			duration: '0.3s',
			detail: 'export async function load({ locals }) {\n\treturn { report: cached };\n}'
		},
		{
			key: 'search',
			name: 'grep',
			status: 'complete',
			target: 'depends(',
			duration: '0.1s'
		},
		{
			key: 'check',
			name: 'run_check',
			status: 'error',
			target: 'pnpm check',
			duration: '4.8s',
			error: 'Exited with code 1 — see detail.'
		}
	];

	let messageValue = $state('');
	let responding = $state(false);
	let reasoningOpen = $state(false);
	let followUpTarget = $state('');
	let followUpQuestion = $state('');
	const followUp = streamText(() => followUpTarget);
	const busy = $derived(responding && !followUp.done);

	function send(message: string) {
		followUpQuestion = message;
		responding = true;
		followUpTarget = `Good question — "${message}" touches the same load function. The short
answer: yes, the \`depends\` key also invalidates any nested layout data, so no extra
work is needed there. If you want finer control, split the report into its own
sub-key such as \`report:\${id}\` and invalidate only that.`;
	}

	function stop() {
		followUpTarget = followUp.text;
		responding = false;
	}

	type Draft = { name: string; type?: Chat.ChatAttachmentType; src?: string; size?: number };
	let drafts = $state<Draft[]>([
		{ name: 'q3-report.pdf', type: 'pdf', size: 1_284_003 },
		{ name: 'notes.txt', type: 'file', size: 2_140 }
	]);

	function addFiles(files: File[]) {
		drafts.push(...files.map((file) => ({ name: file.name, size: file.size })));
	}

	// Second chat: empty state with suggestions.
	let secondValue = $state('');
	const suggestions = [
		'Summarize the weekly report',
		'Explain the cache invalidation fix',
		'Draft a status update'
	];
</script>

<div class="mx-auto flex max-w-3xl flex-col gap-10 p-6">
	<section class="flex h-[42rem] flex-col gap-3">
		<h2 class="text-lg font-semibold">AI chat</h2>
		<Chat.Root class="min-h-0 rounded-xl border p-3">
			<Chat.MessageList streaming={busy} newMessagesLabel="New messages">
				<Chat.SystemMessage>Conversation started</Chat.SystemMessage>

				<Chat.Message role="user">
					<Chat.MessageBubble group="first">
						Here is the traffic chart — why the spike in week 4?
					</Chat.MessageBubble>
					<Chat.MessageBubble group="last" variant="ghost" class="px-0 py-0">
						<Chat.Attachments>
							<Chat.Attachment
								name="traffic-week-4.svg"
								type="image"
								src={chartImage}
								size={18_432}
							/>
							<Chat.Attachment name="raw-logs.csv" size={5_224_010} />
						</Chat.Attachments>
					</Chat.MessageBubble>
					<Chat.MessageMetadata>
						<Timestamp date={Date.now() - 4 * 60_000} />
					</Chat.MessageMetadata>
				</Chat.Message>

				<Chat.Message role="assistant">
					<Chat.MessageBubble variant="ghost" class="flex w-full max-w-none flex-col gap-3 px-0">
						<Chat.Reasoning bind:open={reasoningOpen} label="Reasoning" working={false}>
							<Markdown
								density="compact"
								content="Comparing the spike window with the deploy log narrows it to the cache change shipped on Monday."
							/>
						</Chat.Reasoning>
						<Chat.ToolCalls calls={toolCalls} />
						<Markdown content={answerMarkdown} {sources} />
					</Chat.MessageBubble>
					<Chat.MessageMetadata>
						<Timestamp date={Date.now() - 2 * 60_000} />
						<Chat.MessageActions
							onCopy={() => navigator.clipboard.writeText(answerMarkdown)}
							onRetry={() => {}}
							onFeedback={() => {}}
						/>
					</Chat.MessageMetadata>
				</Chat.Message>

				{#if followUpQuestion}
					<Chat.Message role="user">
						<Chat.MessageBubble>{followUpQuestion}</Chat.MessageBubble>
					</Chat.Message>
				{/if}
				{#if followUpTarget}
					<Chat.Message role="assistant">
						<Chat.MessageBubble variant="ghost" class="w-full max-w-none px-0">
							<Markdown content={followUp.text} streaming={!followUp.done} />
						</Chat.MessageBubble>
					</Chat.Message>
				{/if}
			</Chat.MessageList>

			<Chat.Composer
				bind:value={messageValue}
				{busy}
				maxRows={6}
				placeholder="Ask a follow-up…"
				onSend={send}
				onStop={stop}
				onFiles={addFiles}
			>
				{#snippet drawer()}
					{#if drafts.length > 0}
						<Chat.Attachments>
							{#each drafts as draft, index (draft.name + index)}
								<Chat.Attachment
									name={draft.name}
									type={draft.type}
									src={draft.src}
									size={draft.size}
									onRemove={() => drafts.splice(index, 1)}
								/>
							{/each}
						</Chat.Attachments>
					{/if}
				{/snippet}
			</Chat.Composer>
		</Chat.Root>
	</section>

	<section class="flex h-96 flex-col gap-3">
		<h2 class="text-lg font-semibold">Empty state</h2>
		<Chat.Root isEmpty class="min-h-0 rounded-xl border p-3">
			{#snippet empty()}
				<p class="text-sm text-muted-foreground">What would you like to work on?</p>
				<Chat.Suggestions items={suggestions} onSelect={(item) => (secondValue = item)} />
			{/snippet}
			<Chat.Composer bind:value={secondValue} placeholder="Start a conversation…" />
		</Chat.Root>
	</section>
</div>
