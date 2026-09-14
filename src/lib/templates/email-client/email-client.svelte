<script lang="ts">
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { onMount, tick } from 'svelte';
	import CalendarIcon from '@lucide/svelte/icons/calendar-days';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import FileIcon from '@lucide/svelte/icons/file';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MailOpenIcon from '@lucide/svelte/icons/mail-open';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import PaperclipIcon from '@lucide/svelte/icons/paperclip';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import ReplyIcon from '@lucide/svelte/icons/reply';
	import SearchIcon from '@lucide/svelte/icons/search';
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
	import * as InputGroup from '#lib/bedrock/ui/input-group';
	import { Label } from '#lib/bedrock/ui/label';
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
	import { Separator } from '#lib/bedrock/ui/separator';
	import * as Sheet from '#lib/bedrock/ui/sheet';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import { mailboxes, messages as initialMessages, type MailboxId } from './data.js';

	let ready = $state(false);
	onMount(() => {
		ready = true;
	});

	type MessageFilter = 'all' | 'unread' | 'starred';

	const mailboxIcons = {
		inbox: InboxIcon,
		starred: StarIcon,
		drafts: FileIcon,
		sent: SendIcon,
		archive: ArchiveIcon
	};

	let messages = $state(initialMessages.map((message) => ({ ...message })));
	let selectedMailbox = $state<MailboxId>('inbox');
	let selectedMessageId = $state(initialMessages[0].id);
	let messageFilter = $state<MessageFilter>('all');
	let query = $state('');
	let selectedIds = $state<string[]>([]);
	let mobilePane = $state<'list' | 'reader'>('list');
	let foldersOpen = $state(false);
	let composeOpen = $state(false);
	let composeTo = $state('');
	let composeSubject = $state('');
	let composeBody = $state('');
	let announcement = $state('');
	let calendarOpen = $state(false);
	let attachmentOpen = $state(false);
	let meetingAccepted = $state(false);

	const mailboxMessages = $derived.by(() => {
		if (selectedMailbox === 'starred') return messages.filter((message) => message.starred);
		return messages.filter((message) => message.mailbox === selectedMailbox);
	});

	const filteredMessages = $derived.by(() => {
		const normalizedQuery = query.trim().toLocaleLowerCase('en-US');
		return mailboxMessages.filter((message) => {
			const matchesFilter =
				messageFilter === 'all' ||
				(messageFilter === 'unread' && message.unread) ||
				(messageFilter === 'starred' && message.starred);
			const matchesQuery =
				!normalizedQuery ||
				`${message.from.name} ${message.subject} ${message.preview}`
					.toLocaleLowerCase('en-US')
					.includes(normalizedQuery);
			return matchesFilter && matchesQuery;
		});
	});

	const currentMessage = $derived(
		mailboxMessages.find((message) => message.id === selectedMessageId) ?? filteredMessages[0]
	);
	const unreadCount = $derived(
		messages.filter((message) => message.mailbox === 'inbox' && message.unread).length
	);
	const allVisibleSelected = $derived(
		filteredMessages.length > 0 &&
			filteredMessages.every((message) => selectedIds.includes(message.id))
	);

	function chooseMailbox(mailbox: MailboxId) {
		selectedMailbox = mailbox;
		messageFilter = 'all';
		query = '';
		selectedIds = [];
		const first =
			mailbox === 'starred'
				? messages.find((message) => message.starred)
				: messages.find((message) => message.mailbox === mailbox);
		if (first) selectedMessageId = first.id;
		mobilePane = 'list';
		foldersOpen = false;
	}

	async function chooseMessage(id: string) {
		selectedMessageId = id;
		mobilePane = 'reader';
		const message = messages.find((item) => item.id === id);
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
		const message = messages.find((item) => item.id === id);
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
			messages = messages.filter((message) => !selectedIds.includes(message.id));
			announcement = `${selectedIds.length} messages deleted locally`;
		} else if (action === 'archive') {
			for (const message of messages) {
				if (selectedIds.includes(message.id)) message.mailbox = 'archive';
			}
			announcement = `${selectedIds.length} messages archived`;
		} else {
			for (const message of messages) {
				if (selectedIds.includes(message.id)) message.unread = false;
			}
			announcement = `${selectedIds.length} messages marked as read`;
		}
		selectedIds = [];
	}

	function openCompose(to = '', subject = '') {
		foldersOpen = false;
		composeTo = to;
		composeSubject = subject;
		composeBody = '';
		composeOpen = true;
	}

	function sendMessage(event: SubmitEvent) {
		event.preventDefault();
		messages.unshift({
			id: `local-${Date.now()}`,
			mailbox: 'sent',
			from: {
				name: 'You',
				email: 'alex@lumenmail.example',
				initials: 'AL',
				tone: 'bg-primary text-primary-foreground'
			},
			to: [composeTo],
			subject: composeSubject,
			preview: composeBody,
			body: composeBody.split('\n').filter(Boolean),
			time: 'Now',
			dateTime: new Date().toISOString(),
			unread: false,
			starred: false
		});
		announcement = `Demo message to ${composeTo} saved in Sent. No email was sent.`;
		composeOpen = false;
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
			event.defaultPrevented ||
			event.ctrlKey ||
			event.metaKey ||
			event.altKey ||
			composeOpen ||
			foldersOpen ||
			calendarOpen ||
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
	<title>Lumen Mail — Email client template</title>
	<meta
		name="description"
		content="A responsive email client template composed with Bedrock UI components."
	/>
</svelte:head>

<div class="mail-app" data-ready={ready} data-mobile-pane={mobilePane}>
	<p class="sr-only" aria-live="polite">{announcement}</p>

	<header class="app-header">
		<div class="brand-lockup">
			<div class="brand-mark" aria-hidden="true"><Icon icon={MailIcon} class="size-4" /></div>
			<span>Lumen</span>
			<Badge variant="secondary" class="hidden sm:inline-flex">Mail</Badge>
		</div>

		<div class="header-search">
			<InputGroup.Root>
				<InputGroup.Addon><Icon icon={SearchIcon} /></InputGroup.Addon>
				<InputGroup.Input
					id="mail-search"
					value={query}
					oninput={(event) => (query = event.currentTarget.value)}
					name="mail-search"
					aria-label="Search mail"
					placeholder="Search mail"
				/>
				<InputGroup.Addon align="inline-end">
					<kbd class="hidden rounded border bg-muted px-1.5 font-mono text-[10px] sm:inline">/</kbd>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>

		<div class="header-actions">
			<IconButton icon={CalendarIcon} label="Open calendar" onclick={() => (calendarOpen = true)} />
			<Avatar class="size-8">
				<AvatarFallback class="bg-primary text-xs text-primary-foreground">AL</AvatarFallback>
			</Avatar>
		</div>
	</header>

	<div class="mail-layout">
		<aside class="folder-pane" aria-label="Mail folders">
			<div class="folder-pane-inner">
				<Button class="w-full justify-start gap-2" onclick={() => openCompose()}>
					<Icon icon={PencilIcon} />
					Compose
					<kbd class="ml-auto rounded bg-primary-foreground/12 px-1.5 font-mono text-[10px]">C</kbd>
				</Button>

				<nav class="folder-nav" aria-label="Mailbox">
					<p class="eyebrow">Mailboxes</p>
					{#each mailboxes as mailbox (mailbox.id)}
						<Button
							variant="ghost"
							class={`folder-button${selectedMailbox === mailbox.id ? ' folder-active' : ''}`}
							aria-current={selectedMailbox === mailbox.id ? 'page' : undefined}
							onclick={() => chooseMailbox(mailbox.id)}
						>
							<Icon icon={mailboxIcons[mailbox.id]} />
							<span>{mailbox.label}</span>
							{#if mailbox.id === 'inbox' && unreadCount > 0}
								<Badge class="ml-auto min-w-5 justify-center px-1.5">{unreadCount}</Badge>
							{:else if messages.filter((message) => message.mailbox === mailbox.id).length}
								<span class="ml-auto text-xs text-muted-foreground"
									>{messages.filter((message) => message.mailbox === mailbox.id).length}</span
								>
							{/if}
						</Button>
					{/each}
				</nav>

				<div class="folder-labels">
					<p class="eyebrow">Labels</p>
					<div class="space-y-1">
						<div class="label-row">
							<span class="size-2 rounded-full bg-violet-500"></span>Launch
						</div>
						<div class="label-row">
							<span class="size-2 rounded-full bg-sky-500"></span>Research
						</div>
						<div class="label-row">
							<span class="size-2 rounded-full bg-rose-500"></span>Reading
						</div>
					</div>
				</div>

				<div class="storage-card">
					<div class="flex items-center justify-between text-xs">
						<span class="font-medium">Storage</span><span class="text-muted-foreground"
							>4.2 of 15 GB</span
						>
					</div>
					<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
						<div class="h-full w-[28%] rounded-full bg-primary"></div>
					</div>
				</div>
			</div>
		</aside>

		<section class="message-pane" aria-label="Message list">
			<div class="message-toolbar">
				<div class="flex min-w-0 items-center gap-2">
					<Sheet.Root open={foldersOpen} onOpenChange={(open) => (foldersOpen = open)}>
						<Sheet.Trigger>
							{#snippet child({ props })}
								<IconButton {...props} class="lg:hidden" icon={MenuIcon} label="Open folders" />
							{/snippet}
						</Sheet.Trigger>
						<Sheet.Content side="left" class="w-72 p-0">
							<Sheet.Header class="border-b px-5 py-4 text-left">
								<Sheet.Title>Mailboxes</Sheet.Title>
								<Sheet.Description>Move between folders and labels.</Sheet.Description>
							</Sheet.Header>
							<div class="p-4">
								<Button class="mb-4 w-full justify-start gap-2" onclick={() => openCompose()}>
									<Icon icon={PencilIcon} />Compose
								</Button>
								{#each mailboxes as mailbox (mailbox.id)}
									<Button
										variant="ghost"
										class={`folder-button${selectedMailbox === mailbox.id ? ' folder-active' : ''}`}
										onclick={() => chooseMailbox(mailbox.id)}
									>
										<Icon icon={mailboxIcons[mailbox.id]} />{mailbox.label}
									</Button>
								{/each}
							</div>
						</Sheet.Content>
					</Sheet.Root>
					<div>
						<p class="eyebrow">{selectedMailbox}</p>
						<h1
							id="mail-list-heading"
							tabindex="-1"
							class="truncate text-lg font-semibold capitalize"
						>
							{selectedMailbox}
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
								<button class="message-summary" onclick={() => chooseMessage(message.id)}>
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
								</button>
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
						{#if query}<Button variant="outline" size="sm" onclick={() => (query = '')}
								>Clear search</Button
							>{/if}
					</div>
				{/if}
			</ScrollArea>
		</section>

		<section class="reader-pane" aria-label="Reading pane">
			{#if currentMessage}
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
						<IconButton
							icon={CalendarIcon}
							label="Open calendar"
							onclick={() => (calendarOpen = true)}
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

						<Separator />

						<button
							class="reply-prompt"
							onclick={() =>
								openCompose(currentMessage.from.email, `Re: ${currentMessage.subject}`)}
						>
							<Icon icon={ReplyIcon} />
							<span>Reply to {currentMessage.from.name}…</span>
						</button>
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

<Dialog.Root open={composeOpen} onOpenChange={(open) => (composeOpen = open)}>
	<Dialog.Content class="gap-0 overflow-hidden p-0 sm:max-w-2xl">
		<form onsubmit={sendMessage}>
			<Dialog.Header class="border-b px-5 py-4">
				<Dialog.Title>New message</Dialog.Title>
				<Dialog.Description
					>Local demo: messages appear in Sent. No email leaves this page.</Dialog.Description
				>
			</Dialog.Header>
			<div class="grid gap-4 p-5">
				<div class="grid gap-1.5">
					<Label for="compose-to">To</Label>
					<Input
						id="compose-to"
						value={composeTo}
						oninput={(event) => (composeTo = event.currentTarget.value)}
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
						value={composeSubject}
						oninput={(event) => (composeSubject = event.currentTarget.value)}
						name="subject"
						placeholder="What is this about?"
						required
					/>
				</div>
				<div class="grid gap-1.5">
					<Label for="compose-body">Message</Label>
					<Textarea
						id="compose-body"
						value={composeBody}
						oninput={(event) => (composeBody = event.currentTarget.value)}
						name="body"
						class="min-h-52 resize-none"
						placeholder="Write your message…"
						required
					/>
				</div>
			</div>
			<Dialog.Footer class="border-t bg-muted/35 px-5 py-3">
				<Dialog.Close>
					{#snippet child({ props })}
						<Button variant="ghost" type="button" {...props}>Cancel</Button>
					{/snippet}
				</Dialog.Close>
				<Button type="submit"><Icon icon={SendIcon} />Send message</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root open={calendarOpen} onOpenChange={(open) => (calendarOpen = open)}>
	<Dialog.Content>
		<Dialog.Header
			><Dialog.Title>Your day, at a glance</Dialog.Title><Dialog.Description
				>Monday, September 14 · Local demo calendar</Dialog.Description
			></Dialog.Header
		>
		<div class="grid gap-4 py-4">
			<div class="rounded-xl border p-4">
				<p class="text-xs text-muted-foreground">11:30–12:00 · Product team</p>
				<h3 class="mt-1 font-semibold">Launch readiness</h3>
				<p class="mt-2 text-sm text-muted-foreground">
					Review banner copy and the support handoff with Marin.
				</p>
				<Button
					class="mt-4"
					variant="outline"
					aria-pressed={meetingAccepted}
					onclick={() => (meetingAccepted = !meetingAccepted)}
					>{meetingAccepted ? 'Accepted · Undo' : 'Accept invitation'}</Button
				>
				<p role="status" class="mt-2 text-sm">
					{meetingAccepted ? 'Added to your demo calendar.' : 'Invitation awaiting your response.'}
				</p>
			</div>
			<div class="rounded-xl border p-4">
				<p class="text-xs text-muted-foreground">14:00–15:00 · Focus time</p>
				<h3 class="mt-1 font-semibold">Prototype review</h3>
				<p class="mt-2 text-sm text-muted-foreground">
					A quiet hour to work through the next iteration.
				</p>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
<Dialog.Root open={attachmentOpen} onOpenChange={(open) => (attachmentOpen = open)}>
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
	.mail-app {
		--mail-sidebar: 15rem;
		--mail-list: 23rem;
		display: grid;
		grid-template-rows: 3.5rem minmax(0, 1fr);
		height: calc(100svh - 7.5rem);
		min-height: 36rem;
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

	.app-header {
		display: grid;
		grid-template-columns: var(--mail-sidebar) minmax(16rem, 38rem) auto;
		align-items: center;
		gap: 1rem;
		border-bottom: 1px solid var(--border);
		padding: 0 1rem;
		background: color-mix(in oklab, var(--background) 94%, transparent);
		backdrop-filter: blur(1rem);
		z-index: 20;
	}

	.brand-lockup,
	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.brand-lockup {
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	.brand-mark {
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		border-radius: 0.65rem;
		background: var(--primary);
		color: var(--primary-foreground);
		box-shadow: 0 0.35rem 1rem color-mix(in oklab, var(--foreground) 12%, transparent);
	}

	.header-search {
		width: min(100%, 38rem);
	}

	.header-actions {
		justify-content: flex-end;
	}

	.mail-layout {
		display: grid;
		grid-template-columns: var(--mail-sidebar) var(--mail-list) minmax(0, 1fr);
		min-height: 0;
	}

	.folder-pane,
	.message-pane {
		border-right: 1px solid var(--border);
	}

	.folder-pane {
		background: color-mix(in oklab, var(--muted) 45%, var(--background));
	}

	.folder-pane-inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 1rem;
	}

	.folder-nav {
		margin-top: 1.5rem;
	}

	.eyebrow {
		margin-bottom: 0.4rem;
		font-size: 0.6875rem;
		font-weight: 650;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}

	:global(.folder-button) {
		width: 100%;
		justify-content: flex-start;
		gap: 0.625rem;
		padding-inline: 0.65rem;
		font-weight: 450;
	}

	:global(.folder-button.folder-active) {
		background: var(--accent);
		color: var(--accent-foreground);
		font-weight: 600;
	}

	.folder-labels {
		margin-top: 1.5rem;
	}

	.label-row {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		border-radius: var(--radius-md);
		padding: 0.45rem 0.65rem;
		font-size: 0.8125rem;
		color: var(--muted-foreground);
	}

	.storage-card {
		margin-top: auto;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 0.75rem;
		background: color-mix(in oklab, var(--card) 82%, transparent);
	}

	.message-pane,
	.reader-pane {
		display: grid;
		min-width: 0;
		min-height: 0;
		background: var(--background);
	}

	.message-pane {
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
		min-height: 4.65rem;
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
		box-shadow: inset 3px 0 0 var(--foreground);
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

	.reader-pane {
		grid-template-rows: auto minmax(0, 1fr);
	}

	.reader-toolbar {
		min-height: 4.65rem;
		padding: 0.75rem 1.25rem;
	}

	.reader-content {
		width: min(100%, 52rem);
		margin-inline: auto;
		padding: clamp(1.5rem, 4vw, 3.5rem);
	}

	.reader-subject {
		max-width: 28ch;
		font-size: clamp(1.55rem, 3vw, 2.25rem);
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

	.reply-prompt {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		width: 100%;
		margin-top: 1.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 0.85rem 1rem;
		color: var(--muted-foreground);
		text-align: left;
		transition:
			background-color var(--motion-state) var(--motion-ease-enter),
			color var(--motion-state) var(--motion-ease-enter),
			border-color var(--motion-state) var(--motion-ease-enter);
	}

	.reply-prompt:hover {
		border-color: color-mix(in oklab, var(--foreground) 30%, var(--border));
		background: var(--accent);
		color: var(--foreground);
	}

	.reply-prompt:focus-visible {
		outline: 3px solid color-mix(in oklab, var(--ring) 50%, transparent);
		outline-offset: 2px;
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

		.app-header {
			grid-template-columns: auto minmax(12rem, 32rem) auto;
		}

		.mail-layout {
			grid-template-columns: var(--mail-list) minmax(0, 1fr);
		}

		.folder-pane {
			display: none;
		}
	}

	@media (max-width: 767px) {
		.mail-app {
			grid-template-rows: 3.5rem minmax(0, 1fr);
		}

		.app-header {
			grid-template-columns: auto minmax(0, 1fr) auto;
			gap: 0.5rem;
			padding-inline: 0.75rem;
		}

		.brand-lockup > span:not(.sr-only) {
			display: none;
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
				opacity var(--motion-state) var(--motion-ease-enter),
				visibility var(--motion-overlay);
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
		.message-row,
		.reply-prompt {
			transition-duration: 0.01ms;
		}
	}
</style>
