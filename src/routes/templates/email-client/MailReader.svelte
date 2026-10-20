<script lang="ts">
	import ListChecksIcon from '@lucide/svelte/icons/list-checks';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CalendarIcon from '@lucide/svelte/icons/calendar-days';
	import FileIcon from '@lucide/svelte/icons/file';
	import MailOpenIcon from '@lucide/svelte/icons/mail-open';
	import ReplyAllIcon from '@lucide/svelte/icons/reply-all';
	import ForwardIcon from '@lucide/svelte/icons/forward';
	import ReplyIcon from '@lucide/svelte/icons/reply';
	import SendIcon from '@lucide/svelte/icons/send';
	import StarIcon from '@lucide/svelte/icons/star';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import { Avatar, AvatarFallback } from '#lib/bedrock/ui/avatar';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
	import { Textarea } from '#lib/bedrock/ui/textarea';

	import { useWorkspace } from '#lib/templates/email-client/workspace.svelte.js';
	import type { MailMessage } from '#lib/templates/email-client/data.js';
	import MailComposer from './MailComposer.svelte';
	const workspace = useWorkspace();
	let {
		currentMessage,
		onPreviewAttachment,
		sendMessage,
		saveDraft,
		closeCompose,
		backToMessages,
		updateCurrent,
		onNavigateCalendar,
		onCreateTask,
		onCreateEvent,
		toggleStar,
		editDraft,
		startResponse
	}: {
		currentMessage: MailMessage | undefined;
		onPreviewAttachment: () => void;
		sendMessage: (event: SubmitEvent) => void;
		saveDraft: () => void;
		closeCompose: () => Promise<void>;
		backToMessages: () => Promise<void>;
		updateCurrent: (action: 'archive' | 'delete') => void;
		onNavigateCalendar: () => Promise<void>;
		onCreateTask: (subject: string, context: string) => Promise<void>;
		onCreateEvent: (subject: string, context: string) => Promise<void>;
		toggleStar: (id: string) => void;
		editDraft: () => void;
		startResponse: (mode: 'reply' | 'reply-all' | 'forward') => Promise<void>;
	} = $props();
</script>

<section class="reader-pane" aria-label="Reading pane">
	{#if workspace.compose.open && workspace.compose.mode === 'new'}
		<MailComposer {sendMessage} {saveDraft} {closeCompose} />
	{:else if currentMessage}
		<div class="reader-toolbar">
			<div class="flex items-center gap-1">
				<IconButton
					class="md:hidden"
					icon={ArrowLeftIcon}
					label="Back to messages"
					onclick={backToMessages}
				/>
				<IconButton
					icon={ArchiveIcon}
					label="Archive message"
					tooltip="Archive"
					onclick={() => updateCurrent('archive')}
				/>
				<IconButton
					icon={TrashIcon}
					label="Delete message"
					tooltip="Delete"
					onclick={() => updateCurrent('delete')}
				/>
				<IconButton icon={CalendarIcon} label="Open calendar" onclick={onNavigateCalendar} />
				<IconButton
					icon={ListChecksIcon}
					label="Create task from message"
					onclick={() =>
						onCreateTask(
							currentMessage.subject,
							`From ${currentMessage.from.name}: ${currentMessage.preview}`
						)}
				/>
				<IconButton
					icon={CalendarIcon}
					label="Schedule from message"
					onclick={() =>
						onCreateEvent(
							currentMessage.subject,
							`From ${currentMessage.from.name}: ${currentMessage.preview}`
						)}
				/>
			</div>
			<div class="flex items-center gap-1">
				<IconButton
					icon={StarIcon}
					label={currentMessage.starred ? 'Unstar message' : 'Star message'}
					class={currentMessage.starred ? 'text-amber-500' : undefined}
					onclick={() => toggleStar(currentMessage.id)}
				/>
			</div>
		</div>

		<ScrollArea class="reader-scroll" edgeBlur="vertical">
			<article class="reader-content">
				<header>
					<div class="mb-3 flex flex-wrap items-center gap-2">
						{#if currentMessage.label}<Badge variant="secondary">{currentMessage.label}</Badge>{/if}
						{#if currentMessage.hasAttachment}<Badge variant="outline">1 attachment</Badge>{/if}
					</div>
					<h2 id="mail-reader-heading" tabindex="-1" class="reader-subject">
						{currentMessage.subject}
					</h2>
					<div class="sender-row">
						<Avatar class="size-10">
							<AvatarFallback class={currentMessage.from.tone}
								>{currentMessage.from.initials}</AvatarFallback
							>
						</Avatar>
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-baseline justify-between gap-x-3">
								<p class="truncate font-semibold">{currentMessage.from.name}</p>
								<time class="text-xs text-muted-foreground" datetime={currentMessage.dateTime}
									>{currentMessage.time}</time
								>
							</div>
							<p class="truncate text-xs text-muted-foreground">
								{currentMessage.from.email} · to {currentMessage.to.join(', ')}
							</p>
						</div>
					</div>
				</header>

				<div class="message-body">
					{#each currentMessage.body as paragraph, index (`${currentMessage.id}-${index}`)}
						<p>{paragraph}</p>
					{/each}
				</div>

				{#if currentMessage.hasAttachment}
					<div class="attachment-card">
						<div class="attachment-icon"><Icon icon={FileIcon} /></div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium">Launch-checklist.pdf</p>
							<p class="text-xs text-muted-foreground">PDF · 1.8 MB</p>
						</div>
						<Button variant="outline" size="sm" onclick={onPreviewAttachment}>Preview</Button>
					</div>
				{/if}

				{#if currentMessage.thread?.length}<section
						class="space-y-3"
						aria-label="Conversation history"
					>
						<h3 class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
							Conversation · {currentMessage.thread.length + 1} messages
						</h3>
						{#each currentMessage.thread as reply, index (`${currentMessage.id}-reply-${index}`)}<div
								class="rounded-xl border bg-muted/25 p-4"
							>
								<div class="flex justify-between gap-3 text-xs">
									<span class="font-semibold">{reply.author}</span><span
										class="text-muted-foreground">{reply.time}</span
									>
								</div>
								<p class="mt-2 text-sm leading-relaxed">{reply.body}</p>
							</div>{/each}
					</section>{/if}
				<div class="message-actions" aria-label="Message actions">
					{#if currentMessage.mailbox === 'drafts'}<Button
							variant="outline"
							size="sm"
							onclick={editDraft}>Edit draft</Button
						>{/if}
					<Button variant="outline" size="sm" onclick={() => startResponse('reply')}
						><ReplyIcon class="size-4" />Reply</Button
					>
					<Button variant="outline" size="sm" onclick={() => startResponse('reply-all')}
						><ReplyAllIcon class="size-4" />Reply all</Button
					>
					<Button variant="outline" size="sm" onclick={() => startResponse('forward')}
						><ForwardIcon class="size-4" />Forward message</Button
					>
				</div>
				{#if workspace.compose.open && workspace.compose.mode !== 'new'}
					<form class="inline-reply" aria-label="Message reply editor" onsubmit={sendMessage}>
						<header class="reply-heading">
							<ReplyIcon class="size-4" />
							<h3>
								{workspace.compose.mode === 'forward'
									? 'Forward'
									: workspace.compose.mode === 'reply-all'
										? 'Reply all'
										: 'Reply'}
							</h3>
							<span>From Alex Lane</span>
						</header>
						<div class="reply-recipient">
							<Label for="compose-to">To</Label><Input
								id="compose-to"
								type="email"
								multiple
								required
								value={workspace.compose.to}
								oninput={(event) => (workspace.compose.to = event.currentTarget.value)}
								placeholder="Add recipients"
							/>
						</div>
						{#if workspace.compose.mode === 'forward'}<div class="reply-recipient">
								<Label for="compose-subject">Subject</Label><Input
									id="compose-subject"
									required
									value={workspace.compose.subject}
									oninput={(event) => (workspace.compose.subject = event.currentTarget.value)}
								/>
							</div>{/if}
						<div class="reply-writing">
							<Label for="compose-body" class="sr-only">Message</Label><Textarea
								id="compose-body"
								value={workspace.compose.body}
								oninput={(event) => (workspace.compose.body = event.currentTarget.value)}
								class="reply-textarea min-h-40 resize-y border-0 bg-transparent shadow-none focus-visible:ring-0"
								placeholder="Write your message…"
								required={workspace.compose.mode !== 'forward'}
							/>
							<p class="reply-signature">Alex Lane</p>
						</div>
						{#if workspace.compose.mode === 'forward'}<blockquote class="forwarded-message">
								<strong>Forwarded message</strong>
								<p>From: {currentMessage.from.name} &lt;{currentMessage.from.email}&gt;</p>
								<p>Subject: {currentMessage.subject}</p>
								{#each currentMessage.body as paragraph, index (index)}<p>{paragraph}</p>{/each}
							</blockquote>{/if}
						<footer class="reply-footer">
							<Button type="submit" size="sm"><SendIcon class="size-4" />Send message</Button
							><Button type="button" size="sm" variant="ghost" onclick={saveDraft}
								>Save draft</Button
							><Button
								type="button"
								size="sm"
								variant="ghost"
								class="ml-auto"
								onclick={closeCompose}><TrashIcon class="size-4" />Discard</Button
							>
						</footer>
					</form>
				{/if}
			</article>
		</ScrollArea>
	{:else}
		<div class="empty-reader">
			<div class="empty-icon"><Icon icon={MailOpenIcon} class="size-5" /></div>
			<h2 class="font-semibold">Choose a message</h2>
			<p>Open a conversation to read and reply.</p>
		</div>
	{/if}
</section>

<style>
	.reader-pane {
		display: grid;
		min-width: 0;
		min-height: 0;
		background: var(--background);
	}
	.reader-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		border-bottom: 1px solid var(--border);
	}
	:global(.reader-scroll) {
		height: 100%;
		min-height: 0;
	}
	.reader-pane {
		grid-template-rows: auto minmax(0, 1fr);
	}
	.reader-toolbar {
		min-height: 86px;
		padding: 0.75rem 1.25rem;
	}
	.reader-content {
		width: min(100%, 52rem);
		margin-inline: auto;
		padding: clamp(1.5rem, 4vw, 3.5rem);
	}
	.reader-subject {
		max-width: 28ch;
		font-size: clamp(1.35rem, 2vw, 1.75rem);
		font-weight: 650;
		line-height: 1.12;
		letter-spacing: -0.035em;
	}
	.sender-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}
	.message-body {
		display: grid;
		gap: 1rem;
		margin-block: 2rem;
		max-width: 66ch;
		font-size: 0.9375rem;
		line-height: 1.75;
		color: color-mix(in oklab, var(--foreground) 88%, var(--muted-foreground));
	}
	.attachment-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		max-width: 28rem;
		margin-bottom: 2rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 0.75rem;
		background: color-mix(in oklab, var(--muted) 35%, transparent);
	}
	.attachment-icon,
	.empty-icon {
		display: grid;
		place-items: center;
		border-radius: var(--radius-lg);
		background: var(--muted);
		color: var(--muted-foreground);
	}
	.attachment-icon {
		width: 2.4rem;
		height: 2.4rem;
	}
	.message-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.75rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--border);
	}
	.inline-reply {
		margin-top: 1rem;
		border: 1px solid var(--border);
		border-top: 2px solid #5967c7;
		border-radius: var(--radius-lg);
		background: var(--background);
		box-shadow: 0 2px 8px #00000006;
	}
	.reply-heading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.8125rem;
		border-bottom: 1px solid var(--border);
	}
	.reply-heading h3 {
		font-weight: 600;
	}
	.reply-heading span {
		margin-left: auto;
		font-size: 0.6875rem;
		color: var(--muted-foreground);
	}
	.reply-recipient {
		display: grid;
		grid-template-columns: 3.25rem minmax(0, 1fr);
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid var(--border);
	}
	.reply-writing {
		padding: 0.5rem;
	}
	.reply-signature {
		margin: 0.25rem 0.5rem 1rem;
		font-size: 0.8125rem;
		color: var(--muted-foreground);
	}
	.reply-footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.375rem;
		padding: 0.75rem;
		border-top: 1px solid var(--border);
		background: color-mix(in oklab, var(--muted) 25%, transparent);
	}
	.forwarded-message {
		margin: 0 1rem 1rem;
		padding: 1rem;
		border-left: 2px solid var(--border);
		font-size: 0.75rem;
		line-height: 1.7;
		color: var(--muted-foreground);
	}
	.forwarded-message p {
		margin-top: 0.5rem;
	}
	.empty-reader {
		display: grid;
		place-items: center;
		align-content: center;
		gap: 0.6rem;
		height: 100%;
		padding: 2rem;
		text-align: center;
		color: var(--muted-foreground);
	}
	.empty-icon {
		width: 2.75rem;
		height: 2.75rem;
		margin-bottom: 0.25rem;
	}
	@media (max-width: 767px) {
		.reader-pane {
			position: absolute;
			inset: 0;
			border: 0;
			transition:
				transform var(--motion-overlay) var(--motion-ease-drawer),
				opacity var(--motion-state) var(--motion-ease-enter);
		}
		.reader-pane {
			transform: translateX(100%);
			opacity: 0;
			visibility: hidden;
		}
		:global(.mail-app[data-mobile-pane='reader']) .reader-pane {
			transform: translateX(0);
			opacity: 1;
			visibility: visible;
		}
		.reader-content {
			padding: 1.25rem;
		}
		.reader-toolbar {
			min-height: 4rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.reader-pane {
			transition-duration: 0.01ms;
		}
	}
</style>
