<script lang="ts">
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MailOpenIcon from '@lucide/svelte/icons/mail-open';
	import PaperclipIcon from '@lucide/svelte/icons/paperclip';
	import ListFilterIcon from '@lucide/svelte/icons/list-filter';
	import StarIcon from '@lucide/svelte/icons/star';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';

	import { useWorkspace, messageHref } from '#lib/templates/email-client/workspace.svelte.js';
	import type { MailMessage, MailboxId } from '#lib/templates/email-client/data.js';
	const workspace = useWorkspace();
	let {
		selectedLabel,
		selectedMailbox,
		messageFilter = $bindable(),
		allVisibleSelected,
		selectedIds,
		filteredMessages,
		currentMessage,
		toggleAllVisible,
		updateSelected,
		setDensity,
		toggleSelection,
		chooseMessage,
		toggleStar
	}: {
		selectedLabel: string | null;
		selectedMailbox: MailboxId;
		messageFilter: 'all' | 'unread' | 'starred';
		allVisibleSelected: boolean;
		selectedIds: string[];
		filteredMessages: MailMessage[];
		currentMessage: MailMessage | undefined;
		toggleAllVisible: (checked: boolean) => void;
		updateSelected: (action: 'read' | 'archive' | 'delete') => void;
		setDensity: (value: string) => void;
		toggleSelection: (id: string, checked: boolean) => void;
		chooseMessage: (id: string) => Promise<void>;
		toggleStar: (id: string) => void;
	} = $props();
</script>

<section class="message-pane" aria-label="Message list">
	<div class="message-toolbar">
		<div class="flex min-w-0 items-center gap-2">
			<div>
				<p class="eyebrow">{selectedLabel ? 'Label' : 'Mailbox'}</p>
				<h1 id="mail-list-heading" tabindex="-1" class="truncate text-lg font-semibold capitalize">
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
				<DropdownMenu.Item onclick={() => (messageFilter = 'starred')}>Starred</DropdownMenu.Item>
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
					<li class={['message-row', { 'message-current': currentMessage?.id === message.id }]}>
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
								<span class={{ 'font-semibold': message.unread }}>{message.from.name}</span>
								<time datetime={message.dateTime}>{message.time}</time>
							</div>
							<div class={['message-subject', { 'font-semibold': message.unread }]}>
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
								label={message.starred ? `Unstar ${message.subject}` : `Star ${message.subject}`}
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

<style>
	.eyebrow {
		margin-bottom: 0.4rem;
		font-size: 0.6875rem;
		font-weight: 650;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}
	.message-pane {
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
	:global(.message-scroll) {
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
		border-radius: var(--radius-lg);
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
	.empty-icon {
		display: grid;
		place-items: center;
		border-radius: var(--radius-lg);
		background: var(--muted);
		color: var(--muted-foreground);
	}
	:global(.mail-app[data-density='compact']) .message-summary {
		padding-block: 0.55rem;
	}
	:global(.mail-app[data-density='compact']) .message-select,
	:global(.mail-app[data-density='compact']) .message-star {
		padding-top: 0.45rem;
	}
	:global(.mail-app[data-density='compact']) .message-preview,
	:global(.mail-app[data-density='compact']) .message-meta {
		display: none;
	}
	.empty-mailbox {
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
		.message-pane {
			position: absolute;
			inset: 0;
			border: 0;
			transition:
				transform var(--motion-overlay) var(--motion-ease-drawer),
				opacity var(--motion-state) var(--motion-ease-enter);
		}
		:global(.mail-app[data-mobile-pane='reader']) .message-pane {
			transform: translateX(-18%);
			opacity: 0;
			visibility: hidden;
		}
		.message-toolbar {
			min-height: 4rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.message-pane,
		.message-row {
			transition-duration: 0.01ms;
		}
	}
</style>
