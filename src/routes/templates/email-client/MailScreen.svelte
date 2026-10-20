<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';

	import MailMessageList from './MailMessageList.svelte';
	import MailReader from './MailReader.svelte';
	import AttachmentPreview from './AttachmentPreview.svelte';
	import { onMount, tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { type MailboxId } from '#lib/templates/email-client/data.js';

	import { page } from '$app/state';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import {
		useWorkspace,
		mailBase,
		messageHref
	} from '#lib/templates/email-client/workspace.svelte.js';
	import { createMailCommands } from '#lib/templates/email-client/mail-commands.js';
	import { demoToday } from '#lib/templates/email-client/productivity-data.js';
	const workspace = useWorkspace();
	const active = true;
	let ready = $state(false);
	const mailParams = $derived(page.params as { folder?: string; message?: string });
	const selectedMailbox = $derived((mailParams.folder ?? 'inbox') as MailboxId);
	const selectedLabel = $derived(browser && ready ? page.url.searchParams.get('label') : null);
	const selectedMessageId = $derived(mailParams.message ?? workspace.localMessageId);
	const onNavigateCalendar = () => goto(`${mailBase}/calendar`);
	async function onCreateTask(subject: string, context: string) {
		workspace.tasks.push({
			id: `mail-task-${Date.now()}`,
			title: subject,
			note: context,
			project: 'Mail follow-up',
			due: demoToday,
			completed: false
		});
		workspace.taskFilter = 'Today';
		workspace.selectedProject = 'All projects';
		workspace.query = '';
		await goto(`${mailBase}/tasks`);
	}
	async function onCreateEvent(subject: string, context: string) {
		workspace.eventDraft = { subject, note: context };
		workspace.query = '';
		await goto(`${mailBase}/calendar`);
	}

	onMount(() => {
		ready = true;
	});

	type MessageFilter = 'all' | 'unread' | 'starred';

	let messageFilter = $state<MessageFilter>('all');
	let selectedIds = $state<string[]>([]);
	let mobilePane = $state<'list' | 'reader'>('list');
	let announcement = $state('');
	let attachmentOpen = $state(false);
	afterNavigate(({ from, to }) => {
		if (
			from?.params?.folder !== to?.params?.folder ||
			from?.url.searchParams.get('label') !== to?.url.searchParams.get('label')
		)
			selectedIds = [];
		mobilePane = mailParams.message || workspace.compose.open ? 'reader' : 'list';
		// Route params and the mobile pane must reach the DOM before focusing.
		// This hook runs in the mounted destination, including when navigation
		// replaced the Mail instance that initiated it.
		void tick().then(() => {
			const id = workspace.compose.open
				? 'compose-to'
				: mailParams.message
					? 'mail-reader-heading'
					: 'mail-list-heading';
			document.getElementById(id)?.focus();
		});
	});

	const mailboxMessages = $derived.by(() => {
		if (selectedLabel)
			return workspace.messages.filter((message) => message.label === selectedLabel);
		if (selectedMailbox === 'starred')
			return workspace.messages.filter((message) => message.starred);
		return workspace.messages.filter((message) => message.mailbox === selectedMailbox);
	});

	const filteredMessages = $derived.by(() => {
		const normalizedQuery = workspace.query.trim().toLocaleLowerCase('en-US');
		return mailboxMessages.filter((message) => {
			const matchesFilter =
				messageFilter === 'all' ||
				(messageFilter === 'unread' && message.unread) ||
				(messageFilter === 'starred' && message.starred);
			const matchesQuery =
				!normalizedQuery ||
				`${message.from.name} ${message.subject} ${message.body.join(' ')}`
					.toLocaleLowerCase('en-US')
					.includes(normalizedQuery);
			return matchesFilter && matchesQuery;
		});
	});

	const currentMessage = $derived(
		workspace.messages.find((message) => message.id === selectedMessageId) ?? filteredMessages[0]
	);
	const allVisibleSelected = $derived(
		filteredMessages.length > 0 &&
			filteredMessages.every((message) => selectedIds.includes(message.id))
	);

	const commands = createMailCommands(
		workspace,
		() => currentMessage,
		(message) => {
			announcement = message;
		}
	);
	const { toggleStar, persistDraft, restoreArchive } = commands;
	function updateSelected(action: 'read' | 'archive' | 'delete') {
		commands.updateMessages(selectedIds, action);
		selectedIds = [];
	}
	function sendMessage(event: SubmitEvent) {
		event.preventDefault();
		commands.sendMessage();
		void closeCompose();
	}

	async function chooseMessage(id: string) {
		if (workspace.compose.open) {
			persistDraft();
			workspace.compose.open = false;
		}
		workspace.localMessageId = id;
		const target = workspace.messages.find((item) => item.id === id);
		if (target) await goto(messageHref(target, selectedMailbox), { reset: false });
		mobilePane = 'reader';
		const message = workspace.messages.find((item) => item.id === id);
		if (message?.unread) {
			message.unread = false;
			announcement = `${message.subject} marked as read`;
		}
	}

	async function backToMessages() {
		mobilePane = 'list';
		workspace.localMessageId = null;
		await goto(`${mailBase}/mail/${selectedMailbox}`, { reset: false });
	}

	function updateCurrent(action: 'archive' | 'delete') {
		if (!currentMessage) return;
		selectedIds = [currentMessage.id];
		updateSelected(action);
		void backToMessages();
	}

	function toggleSelection(id: string, checked: boolean) {
		selectedIds = checked ? [...selectedIds, id] : selectedIds.filter((value) => value !== id);
	}

	function toggleAllVisible(checked: boolean) {
		const visibleIds = filteredMessages.map((message) => message.id);
		selectedIds = checked
			? [...new Set([...selectedIds, ...visibleIds])]
			: selectedIds.filter((id) => !visibleIds.includes(id));
	}

	async function openCompose(to = '', subject = '', body = '', replyId: string | null = null) {
		commands.openCompose(to, subject, body, replyId);
		mobilePane = 'reader';
		await tick();
		document.getElementById(replyId ? 'compose-body' : 'compose-to')?.focus();
	}

	function setDensity(value: string) {
		if (value !== 'comfortable' && value !== 'compact') return;
		workspace.mailDensity = value;
		try {
			localStorage.setItem('lumen-mail-density', value);
		} catch {
			/* Session preference still works. */
		}
	}
	async function startResponse(mode: 'reply' | 'reply-all' | 'forward') {
		if (!currentMessage) return;
		const message = currentMessage;
		const previousBody =
			workspace.compose.open && workspace.compose.mode !== 'new' ? workspace.compose.body : '';
		if (workspace.compose.open && workspace.compose.mode === 'new') persistDraft();
		const others = message.to.flatMap((recipient) =>
			recipient === 'Product team'
				? ['product@northstar.example']
				: recipient.includes('@') && recipient !== 'alex@lumenmail.example'
					? [recipient]
					: []
		);
		workspace.compose = {
			open: true,
			mode,
			draftId: null,
			replyId: mode === 'forward' ? null : message.id,
			sourceMessageId: message.id,
			to:
				mode === 'forward'
					? ''
					: [...new Set([message.from.email, ...(mode === 'reply-all' ? others : [])])].join(', '),
			subject: `${mode === 'forward' ? 'Fwd' : 'Re'}: ${message.subject.replace(/^(Re|Fwd):\s*/i, '')}`,
			body: previousBody
		};
		mobilePane = 'reader';
		await tick();
		document.getElementById(mode === 'forward' ? 'compose-to' : 'compose-body')?.focus();
	}

	async function closeCompose() {
		workspace.compose.open = false;
		await tick();
		if (currentMessage) document.getElementById('mail-reader-heading')?.focus();
		else await backToMessages();
	}

	function saveDraft() {
		persistDraft();
		void closeCompose();
	}
	function editDraft() {
		if (!currentMessage) return;
		openCompose(currentMessage.to[0] ?? '', currentMessage.subject, currentMessage.body.join('\n'));
		workspace.compose.draftId = currentMessage.id;
	}

	function navigateMessage(direction: 1 | -1) {
		if (!filteredMessages.length) return;
		const index = filteredMessages.findIndex((message) => message.id === currentMessage?.id);
		const nextIndex = Math.min(filteredMessages.length - 1, Math.max(0, index + direction));
		const next = filteredMessages[nextIndex];
		if (next) chooseMessage(next.id);
	}

	function handleShortcut(event: KeyboardEvent) {
		if (
			!active ||
			event.defaultPrevented ||
			event.ctrlKey ||
			event.metaKey ||
			event.altKey ||
			workspace.compose.open ||
			attachmentOpen
		)
			return;
		const target = event.target as HTMLElement | null;
		if (!target?.closest('.mail-app')) return;
		const isTyping = target?.matches('input, textarea, [contenteditable="true"]');
		if (event.key === '/' && !isTyping) {
			event.preventDefault();
			document.querySelector<HTMLInputElement>('#mail-search')?.focus();
		} else if (event.key.toLocaleLowerCase('en-US') === 'c' && !isTyping) {
			event.preventDefault();
			openCompose();
		} else if (event.key === 'ArrowDown' && target?.matches('.message-summary')) {
			event.preventDefault();
			navigateMessage(1);
		} else if (event.key === 'ArrowUp' && target?.matches('.message-summary')) {
			event.preventDefault();
			navigateMessage(-1);
		}
	}
</script>

<svelte:window onkeydown={handleShortcut} />

<svelte:head>
	<meta
		name="description"
		content="A responsive email client template composed with Bedrock UI components."
	/>
</svelte:head>

<div
	class={['mail-app', { 'has-undo': workspace.undoArchive.length > 0 }]}
	data-ready={ready}
	data-density={workspace.mailDensity}
	data-mobile-pane={workspace.compose.open || mailParams.message ? 'reader' : mobilePane}
>
	<p class="sr-only" aria-live="polite">{announcement}</p>

	{#if workspace.undoArchive.length}<div
			class="archive-notice flex items-center justify-between gap-3 border-b bg-muted px-4 py-2 text-sm"
		>
			<span>{workspace.undoArchive.length} messages archived</span><Button
				size="sm"
				variant="outline"
				onclick={restoreArchive}>Undo archive</Button
			>
		</div>{/if}
	<div class="mail-layout">
		<MailMessageList
			{selectedLabel}
			{selectedMailbox}
			bind:messageFilter
			{allVisibleSelected}
			{selectedIds}
			{filteredMessages}
			{currentMessage}
			{toggleAllVisible}
			{updateSelected}
			{setDensity}
			{toggleSelection}
			{chooseMessage}
			{toggleStar}
		/>

		<MailReader
			{currentMessage}
			onPreviewAttachment={() => (attachmentOpen = true)}
			{sendMessage}
			{saveDraft}
			{closeCompose}
			{backToMessages}
			{updateCurrent}
			{onNavigateCalendar}
			{onCreateTask}
			{onCreateEvent}
			{toggleStar}
			{editDraft}
			{startResponse}
		/>
	</div>
</div>

<AttachmentPreview bind:open={attachmentOpen} />

<style>
	.mail-app {
		--mail-sidebar: 15rem;
		--mail-list: clamp(19rem, 28vw, 25rem);
		display: grid;
		grid-template-rows: minmax(0, 1fr);
		height: 100%;
		min-height: 0;
		background:
			radial-gradient(
				circle at 72% 0%,
				color-mix(in oklab, var(--primary) 4%, transparent),
				transparent 24rem
			),
			var(--background);
		color: var(--foreground);
		overflow: hidden;
	}
	.mail-app.has-undo {
		grid-template-rows: auto minmax(0, 1fr);
	}
	.mail-layout {
		display: grid;
		grid-template-columns: var(--mail-list) minmax(0, 1fr);
		min-height: 0;
	}
	@media (max-width: 1023px) {
		.mail-app {
			--mail-list: min(23rem, 42vw);
		}
		.mail-layout {
			grid-template-columns: var(--mail-list) minmax(0, 1fr);
		}
	}
	@media (max-width: 767px) {
		.mail-app {
			height: 100%;
			min-height: 0;
			grid-template-rows: minmax(0, 1fr);
		}
		.mail-layout {
			display: block;
			position: relative;
		}
	}
</style>
