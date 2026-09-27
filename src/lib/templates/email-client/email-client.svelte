<script lang="ts">
	import ListChecksIcon from '@lucide/svelte/icons/list-checks';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { onMount, tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import CalendarIcon from '@lucide/svelte/icons/calendar-days';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import FileIcon from '@lucide/svelte/icons/file';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MailOpenIcon from '@lucide/svelte/icons/mail-open';
	import PaperclipIcon from '@lucide/svelte/icons/paperclip';
	import ReplyAllIcon from '@lucide/svelte/icons/reply-all';
	import ForwardIcon from '@lucide/svelte/icons/forward';
	import ListFilterIcon from '@lucide/svelte/icons/list-filter';
	import ReplyIcon from '@lucide/svelte/icons/reply';
	import SendIcon from '@lucide/svelte/icons/send';
	import StarIcon from '@lucide/svelte/icons/star';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import { Avatar, AvatarFallback } from '#lib/bedrock/ui/avatar';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import { type MailboxId } from './data.js';

	import { page } from '$app/state';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { useWorkspace, mailBase, messageHref } from './workspace.svelte.js';
	import { demoToday } from './productivity-data.js';
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
	afterNavigate(() => {
		mobilePane = mailParams.message || workspace.compose.open ? 'reader' : 'list';
		if (workspace.compose.open) document.getElementById('compose-to')?.focus();
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
		await tick();
		await new Promise<void>((resolve) =>
			requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
		);
		document.querySelector<HTMLHeadingElement>('#mail-reader-heading')?.focus();
	}

	async function backToMessages() {
		mobilePane = 'list';
		workspace.localMessageId = null;
		await goto(`${mailBase}/mail/${selectedMailbox}`, { reset: false });
		await tick();
		await new Promise<void>((resolve) =>
			requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
		);
		document.querySelector<HTMLHeadingElement>('#mail-list-heading')?.focus();
	}

	function updateCurrent(action: 'archive' | 'delete') {
		if (!currentMessage) return;
		selectedIds = [currentMessage.id];
		updateSelected(action);
		void backToMessages();
	}

	function toggleStar(id: string) {
		const message = workspace.messages.find((item) => item.id === id);
		if (!message) return;
		message.starred = !message.starred;
		announcement = `${message.subject} ${message.starred ? 'starred' : 'unstarred'}`;
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

	function updateSelected(action: 'read' | 'archive' | 'delete') {
		if (action === 'delete') {
			workspace.messages = workspace.messages.filter(
				(message) => !selectedIds.includes(message.id)
			);
			announcement = `${selectedIds.length} messages deleted locally`;
		} else if (action === 'archive') {
			workspace.undoArchive = workspace.messages
				.filter((message) => selectedIds.includes(message.id))
				.map((message) => ({ id: message.id, mailbox: message.mailbox }));
			for (const message of workspace.messages) {
				if (selectedIds.includes(message.id)) message.mailbox = 'archive';
			}
			announcement = `${selectedIds.length} messages archived`;
		} else {
			for (const message of workspace.messages) {
				if (selectedIds.includes(message.id)) message.unread = false;
			}
			announcement = `${selectedIds.length} messages marked as read`;
		}
		selectedIds = [];
		workspace.localMessageId = null;
	}

	async function openCompose(to = '', subject = '', body = '', replyId: string | null = null) {
		if (workspace.compose.open) {
			persistDraft();
			workspace.compose.open = false;
		}
		workspace.compose.mode = 'new';
		workspace.compose.draftId = null;
		workspace.compose.replyId = replyId;
		workspace.compose.to = to;
		workspace.compose.subject = subject;
		workspace.compose.body = body;
		workspace.compose.open = true;
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
	function composedBody() {
		return workspace.compose.mode === 'forward' && currentMessage
			? `${workspace.compose.body}\n\nForwarded message from ${currentMessage.from.name} <${currentMessage.from.email}>:\n${currentMessage.body.join('\n')}`
			: workspace.compose.body;
	}
	function persistDraft() {
		const draft = {
			id: workspace.compose.draftId ?? `draft-${Date.now()}`,
			mailbox: 'drafts' as const,
			from: {
				name: 'You',
				email: 'alex@lumenmail.example',
				initials: 'AL',
				tone: 'bg-primary text-primary-foreground'
			},
			to: workspace.compose.to
				.split(',')
				.map((recipient) => recipient.trim())
				.filter(Boolean),
			subject: workspace.compose.subject || '(No subject)',
			preview: workspace.compose.body,
			body: composedBody().split('\n'),
			time: 'Draft',
			dateTime: new Date().toISOString(),
			unread: false,
			starred: false
		};
		workspace.messages = workspace.compose.draftId
			? workspace.messages.map((message) =>
					message.id === workspace.compose.draftId ? draft : message
				)
			: [draft, ...workspace.messages];
		announcement = 'Draft saved locally. Find it in Drafts.';
	}
	function restoreArchive() {
		for (const item of workspace.undoArchive) {
			const message = workspace.messages.find((message) => message.id === item.id);
			if (message) message.mailbox = item.mailbox;
		}
		announcement = `Restored ${workspace.undoArchive.length} messages.`;
		workspace.undoArchive = [];
	}
	function editDraft() {
		if (!currentMessage) return;
		openCompose(currentMessage.to[0] ?? '', currentMessage.subject, currentMessage.body.join('\n'));
		workspace.compose.draftId = currentMessage.id;
	}
	function sendMessage(event: SubmitEvent) {
		event.preventDefault();
		if (workspace.compose.draftId)
			workspace.messages = workspace.messages.filter(
				(message) => message.id !== workspace.compose.draftId
			);
		if (workspace.compose.replyId) {
			const original = workspace.messages.find(
				(message) => message.id === workspace.compose.replyId
			);
			if (original)
				original.thread = [
					...(original.thread ?? []),
					{ author: 'You', time: 'Just now', body: workspace.compose.body }
				];
		}
		workspace.messages.unshift({
			id: `local-${Date.now()}`,
			mailbox: 'sent',
			from: {
				name: 'You',
				email: 'alex@lumenmail.example',
				initials: 'AL',
				tone: 'bg-primary text-primary-foreground'
			},
			to: workspace.compose.to
				.split(',')
				.map((recipient) => recipient.trim())
				.filter(Boolean),
			subject: workspace.compose.subject,
			preview: workspace.compose.body,
			body: composedBody().split('\n').filter(Boolean),
			time: 'Now',
			dateTime: new Date().toISOString(),
			unread: false,
			starred: false
		});
		announcement = `Demo message to ${workspace.compose.to} saved in Sent. No email was sent.`;
		void closeCompose();
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
	class="mail-app"
	data-ready={ready}
	data-density={workspace.mailDensity}
	data-mobile-pane={workspace.compose.open || mailParams.message ? 'reader' : mobilePane}
	class:has-undo={workspace.undoArchive.length > 0}
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
		<section class="message-pane" aria-label="Message list">
			<div class="message-toolbar">
				<div class="flex min-w-0 items-center gap-2">
					<div>
						<p class="eyebrow">{selectedLabel ? 'Label' : 'Mailbox'}</p>
						<h1
							id="mail-list-heading"
							tabindex="-1"
							class="truncate text-lg font-semibold capitalize"
						>
							{selectedLabel ?? selectedMailbox}
						</h1>
					</div>
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" size="sm" {...props}>
								{messageFilter === 'all' ? 'All mail' : messageFilter}
								<Icon icon={ChevronDownIcon} />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Label>Show</DropdownMenu.Label>
						<DropdownMenu.Item onclick={() => (messageFilter = 'all')}>All mail</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => (messageFilter = 'unread')}>Unread</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => (messageFilter = 'starred')}
							>Starred</DropdownMenu.Item
						>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			<div class="selection-toolbar">
				<div class="flex items-center gap-2">
					<Checkbox
						checked={allVisibleSelected}
						onCheckedChange={(checked) => toggleAllVisible(checked === true)}
						aria-label="Select all visible messages"
					/>
					<span class="text-xs text-muted-foreground">
						{selectedIds.length
							? `${selectedIds.length} selected`
							: `${filteredMessages.length} messages`}
					</span>
				</div>
				{#if selectedIds.length}
					<div class="flex items-center gap-1">
						<IconButton
							icon={MailOpenIcon}
							label="Mark selected as read"
							size="sm"
							onclick={() => updateSelected('read')}
						/>
						<IconButton
							icon={ArchiveIcon}
							label="Archive selected"
							size="sm"
							onclick={() => updateSelected('archive')}
						/>
						<IconButton
							icon={TrashIcon}
							label="Delete selected"
							size="sm"
							onclick={() => updateSelected('delete')}
						/>
					</div>
				{:else}
					<DropdownMenu.Root
						><DropdownMenu.Trigger
							>{#snippet child({ props })}<Button
									{...props}
									variant="ghost"
									size="sm"
									aria-label="Mail list density"
									><ListFilterIcon class="size-4" />{workspace.mailDensity === 'compact'
										? 'Compact'
										: 'View'}</Button
								>{/snippet}</DropdownMenu.Trigger
						><DropdownMenu.Content align="end" class="w-44"
							><DropdownMenu.Label>List density</DropdownMenu.Label><DropdownMenu.RadioGroup
								value={workspace.mailDensity}
								onValueChange={setDensity}
								><DropdownMenu.RadioItem value="comfortable">Comfortable</DropdownMenu.RadioItem
								><DropdownMenu.RadioItem value="compact">Compact</DropdownMenu.RadioItem
								></DropdownMenu.RadioGroup
							></DropdownMenu.Content
						></DropdownMenu.Root
					>
				{/if}
			</div>

			<ScrollArea class="message-scroll" edgeBlur="vertical">
				{#if filteredMessages.length}
					<ul class="message-list">
						{#each filteredMessages as message (message.id)}
							<li class="message-row" class:message-current={currentMessage?.id === message.id}>
								<div class="message-select">
									<Checkbox
										checked={selectedIds.includes(message.id)}
										onCheckedChange={(checked) => toggleSelection(message.id, checked === true)}
										aria-label={`Select message from ${message.from.name}`}
									/>
								</div>
								<a
									class="message-summary"
									href={messageHref(message, selectedMailbox)}
									onclick={(event) => {
										if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
										event.preventDefault();
										void chooseMessage(message.id);
									}}
								>
									<div class="message-title-line">
										<span class:font-semibold={message.unread}>{message.from.name}</span>
										<time datetime={message.dateTime}>{message.time}</time>
									</div>
									<div class="message-subject" class:font-semibold={message.unread}>
										{#if message.unread}<span class="unread-dot" aria-label="Unread"></span>{/if}
										<span class="truncate">{message.subject}</span>
									</div>
									<p class="message-preview">{message.preview}</p>
									<div class="message-meta">
										{#if message.label}<Badge variant="secondary">{message.label}</Badge>{/if}
										{#if message.hasAttachment}<Icon icon={PaperclipIcon} class="size-3.5" />{/if}
									</div>
								</a>
								<div class="message-star">
									<IconButton
										icon={StarIcon}
										label={message.starred
											? `Unstar ${message.subject}`
											: `Star ${message.subject}`}
										size="sm"
										class={message.starred ? 'text-amber-500' : undefined}
										onclick={() => toggleStar(message.id)}
									/>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<div class="empty-mailbox">
						<div class="empty-icon"><Icon icon={MailIcon} class="size-5" /></div>
						<h2 class="font-semibold">No messages here</h2>
						<p>Try another filter or clear your search.</p>
						{#if workspace.query}<Button
								variant="outline"
								size="sm"
								onclick={() => (workspace.query = '')}>Clear search</Button
							>{/if}
					</div>
				{/if}
			</ScrollArea>
		</section>

		<section class="reader-pane" aria-label="Reading pane">
			{#if workspace.compose.open && workspace.compose.mode === 'new'}
				<form class="compose-pane" aria-labelledby="compose-heading" onsubmit={sendMessage}>
					<header class="border-b px-5 py-4">
						<div class="mb-2 flex items-center gap-3">
							<Button type="button" variant="ghost" size="sm" onclick={saveDraft}
								><ArrowLeftIcon class="size-4" />Back</Button
							>
							<h2 id="compose-heading" class="text-lg font-semibold">
								{workspace.compose.replyId ? 'Reply' : 'New message'}
							</h2>
						</div>
						<p class="text-xs text-muted-foreground">
							Local demo: messages appear in Sent. No email leaves this page.
						</p>
					</header>
					<div class="grid gap-4 p-5">
						<div class="grid gap-1.5">
							<Label for="compose-to">To</Label>
							<Input
								id="compose-to"
								value={workspace.compose.to}
								oninput={(event) => (workspace.compose.to = event.currentTarget.value)}
								name="to"
								type="email"
								placeholder="name@example.com"
								required
							/>
						</div>
						<div class="grid gap-1.5">
							<Label for="compose-subject">Subject</Label>
							<Input
								id="compose-subject"
								value={workspace.compose.subject}
								oninput={(event) => (workspace.compose.subject = event.currentTarget.value)}
								name="subject"
								placeholder="What is this about?"
								required
							/>
						</div>
						<div class="grid gap-1.5">
							<Label for="compose-body">Message</Label>
							<Textarea
								id="compose-body"
								value={workspace.compose.body}
								oninput={(event) => (workspace.compose.body = event.currentTarget.value)}
								name="body"
								class="min-h-52 resize-none"
								placeholder="Write your message…"
								required
							/>
						</div>
					</div>
					<footer class="flex flex-wrap justify-end gap-2 border-t bg-muted/35 px-5 py-3">
						<Button variant="ghost" type="button" onclick={closeCompose}>Cancel</Button>
						<Button type="button" variant="outline" onclick={saveDraft}>Save draft</Button><Button
							type="submit"><Icon icon={SendIcon} />Send message</Button
						>
					</footer>
				</form>
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
								{#if currentMessage.label}<Badge variant="secondary">{currentMessage.label}</Badge
									>{/if}
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
								<Button variant="outline" size="sm" onclick={() => (attachmentOpen = true)}
									>Preview</Button
								>
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
	</div>
</div>

<Dialog.Root open={active && attachmentOpen} onOpenChange={(open) => (attachmentOpen = open)}>
	<Dialog.Content
		><Dialog.Header
			><Dialog.Title>Launch checklist</Dialog.Title><Dialog.Description
				>Illustrative attachment preview · No download required</Dialog.Description
			></Dialog.Header
		>
		<ul class="list-disc space-y-3 py-4 pl-5">
			<li>Approve the final migration banner copy.</li>
			<li>Confirm the support handoff at 09:00.</li>
			<li>Check the rollout dashboard before opening traffic.</li>
		</ul></Dialog.Content
	>
</Dialog.Root>

<style>
	.compose-pane {
		min-height: 0;
		overflow-y: auto;
		height: 100%;
		background: var(--card);
	}

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

	.eyebrow {
		margin-bottom: 0.4rem;
		font-size: 0.6875rem;
		font-weight: 650;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}

	.message-pane,
	.reader-pane {
		display: grid;
		min-width: 0;
		min-height: 0;
		background: var(--background);
	}

	.message-pane {
		border-right: 1px solid var(--border);
		grid-template-rows: auto auto minmax(0, 1fr);
	}

	.message-toolbar,
	.reader-toolbar,
	.selection-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		border-bottom: 1px solid var(--border);
	}

	.message-toolbar {
		min-height: 86px;
		padding: 0.75rem 1rem;
	}

	.selection-toolbar {
		min-height: 2.75rem;
		padding: 0.35rem 1rem;
		background: color-mix(in oklab, var(--muted) 35%, transparent);
	}

	:global(.message-scroll),
	:global(.reader-scroll) {
		height: 100%;
		min-height: 0;
	}

	.message-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.message-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		position: relative;
		border-bottom: 1px solid color-mix(in oklab, var(--border) 75%, transparent);
		background: var(--background);
		transition:
			background-color var(--motion-state) var(--motion-ease-enter),
			box-shadow var(--motion-state) var(--motion-ease-enter);
	}

	.message-row:hover {
		background: color-mix(in oklab, var(--accent) 58%, var(--background));
	}

	.message-row.message-current {
		background: var(--accent);
		box-shadow: inset 3px 0 0 #5967c7;
	}

	.message-select,
	.message-star {
		padding-top: 1rem;
	}

	.message-select {
		padding-left: 1rem;
	}

	.message-star {
		padding-right: 0.4rem;
	}

	.message-summary {
		min-width: 0;
		padding: 0.85rem 0.4rem 0.9rem 0.75rem;
		text-align: left;
		outline: none;
	}

	.message-summary:focus-visible {
		border-radius: var(--radius-md);
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
	}

	.message-title-line,
	.message-subject,
	.message-meta {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.message-title-line {
		justify-content: space-between;
		font-size: 0.8125rem;
	}

	.message-title-line time {
		flex: none;
		font-size: 0.6875rem;
		color: var(--muted-foreground);
	}

	.message-subject {
		margin-top: 0.25rem;
		font-size: 0.8125rem;
	}

	.unread-dot {
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 999px;
		background: var(--foreground);
		flex: none;
	}

	.message-preview {
		display: -webkit-box;
		margin-top: 0.25rem;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		font-size: 0.75rem;
		line-height: 1.45;
		color: var(--muted-foreground);
	}

	.message-meta {
		min-height: 1.25rem;
		margin-top: 0.55rem;
		color: var(--muted-foreground);
	}

	.compose-pane {
		grid-row: 1 / -1;
		min-height: 0;
		overflow-y: auto;
		padding-bottom: 60px;
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
		border-radius: 4px;
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
	.mail-app[data-density='compact'] .message-summary {
		padding-block: 0.55rem;
	}
	.mail-app[data-density='compact'] .message-select,
	.mail-app[data-density='compact'] .message-star {
		padding-top: 0.45rem;
	}
	.mail-app[data-density='compact'] .message-preview,
	.mail-app[data-density='compact'] .message-meta {
		display: none;
	}

	.empty-mailbox,
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

		.message-pane,
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

		.mail-app[data-mobile-pane='reader'] .message-pane {
			transform: translateX(-18%);
			opacity: 0;
			visibility: hidden;
		}

		.mail-app[data-mobile-pane='reader'] .reader-pane {
			transform: translateX(0);
			opacity: 1;
			visibility: visible;
		}

		.reader-content {
			padding: 1.25rem;
		}

		.reader-toolbar,
		.message-toolbar {
			min-height: 4rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.message-pane,
		.reader-pane,
		.message-row {
			transition-duration: 0.01ms;
		}
	}
</style>
