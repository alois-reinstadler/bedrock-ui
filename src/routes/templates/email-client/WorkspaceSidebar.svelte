<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';

	import Mail from '@lucide/svelte/icons/mail';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import ListChecks from '@lucide/svelte/icons/list-checks';

	import Plus from '@lucide/svelte/icons/plus';
	import Inbox from '@lucide/svelte/icons/inbox';
	import Star from '@lucide/svelte/icons/star';
	import Send from '@lucide/svelte/icons/send';
	import File from '@lucide/svelte/icons/file';
	import Archive from '@lucide/svelte/icons/archive';

	import { mailboxes } from '#lib/templates/email-client/data.js';
	import { useWorkspace, mailBase } from '#lib/templates/email-client/workspace.svelte.js';
	const workspace = useWorkspace();
	let {
		screen,
		activeFolder,
		label,
		mobileFolders,
		compose
	}: {
		screen: 'mail' | 'calendar' | 'tasks';
		activeFolder: string;
		label: string | null;
		mobileFolders: boolean;
		compose: () => Promise<void>;
	} = $props();
	const sections = [
		{ id: 'mail', label: 'Mail', icon: Mail, href: mailBase },
		{ id: 'calendar', label: 'Calendar', icon: CalendarDays, href: `${mailBase}/calendar` },
		{ id: 'tasks', label: 'Tasks', icon: ListChecks, href: `${mailBase}/tasks` }
	];
	const folderIcons = { inbox: Inbox, starred: Star, drafts: File, sent: Send, archive: Archive };
</script>

<aside class={['workspace-sidebar', { 'mobile-open': mobileFolders }]}>
	<a class="brand" href={mailBase}
		><span class="brand-icon"><Mail size={20} /></span>Lumen<span class="workspace-label"
			>Workspace</span
		></a
	>
	<nav aria-label="Productivity screens" class="app-navigation">
		{#each sections as section (section.id)}<a
				href={section.href}
				aria-label={section.label}
				onclick={() => (workspace.query = '')}
				class={[{ active: screen === section.id }]}
				aria-current={screen === section.id ? 'page' : undefined}
				><section.icon size={18} /><span>{section.label}</span>{#if section.id === 'mail'}<small
						>{workspace.messages.filter((m) => m.unread && m.mailbox === 'inbox').length}</small
					>{/if}</a
			>{/each}
	</nav>
	<div class="sidebar-details">
		<Button
			variant="ghost"
			type="button"
			class={[
				'control-templates-email-client-productivity-workspace h-auto whitespace-normal',
				'compose-button'
			]}
			onclick={compose}><Plus size={17} />Compose</Button
		>
		<nav aria-label="Mailbox" class="folder-navigation">
			<p>Mailboxes</p>
			{#each mailboxes as folder (folder.id)}{@const FolderIcon = folderIcons[folder.id]}<a
					href={`${mailBase}/mail/${folder.id}`}
					class={[{ active: screen === 'mail' && activeFolder === folder.id && !label }]}
					aria-current={screen === 'mail' && activeFolder === folder.id && !label
						? 'page'
						: undefined}
					onclick={() => {
						workspace.query = '';
						workspace.localMessageId = null;
					}}
					><FolderIcon size={16} /><span>{folder.label}</span><small
						>{workspace.messages.filter((m) =>
							folder.id === 'starred' ? m.starred : m.mailbox === folder.id
						).length || ''}</small
					></a
				>{/each}
		</nav>
		<nav aria-label="Mail labels" class="folder-navigation">
			<p>Labels</p>
			{#each ['Launch', 'Research', 'Reading'] as item, index (item)}<a
					href={`${mailBase}?label=${item}`}
					aria-label={`Show ${item} mail`}
					class={[{ active: label === item && screen === 'mail' }]}
					><i class={`label-dot tone-${index}`}></i><span>{item}</span></a
				>{/each}
		</nav>
		<div class="sidebar-footer">
			<span class="presence"></span>All changes saved in this session
		</div>
	</div>
</aside>

<style>
	.productivity-workspace {
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr);
		height: 100dvh;
		overflow: hidden;
		background: var(--background);
		color: var(--foreground);
		font-size: 14px;
	}
	.workspace-sidebar {
		display: flex;
		flex-direction: column;
		background: color-mix(in oklab, var(--muted) 65%, var(--background));
		border-right: 1px solid var(--border);
		min-height: 0;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 9px;
		height: 72px;
		padding: 0 22px;
		font-size: 22px;
		font-weight: 650;
		letter-spacing: -1px;
	}
	.brand-icon {
		display: grid;
		place-items: center;
		background: #5967c7;
		color: white;
		width: 31px;
		height: 31px;
		border-radius: 10px;
	}
	.workspace-label {
		display: none;
	}
	.app-navigation {
		padding: 0 12px 16px;
		border-bottom: 1px solid var(--border);
	}
	.app-navigation a,
	.folder-navigation a {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 10px 12px;
		border-radius: var(--radius-lg);
		color: var(--muted-foreground);
		font-size: 13px;
	}
	.app-navigation a.active {
		background: var(--background);
		color: var(--foreground);
		font-weight: 600;
		box-shadow: 0 1px 3px #00000009;
	}
	.app-navigation a:hover,
	.folder-navigation a:hover {
		background: var(--accent);
		color: var(--foreground);
	}
	a small {
		margin-left: auto;
		font-size: 11px;
		font-variant-numeric: tabular-nums;
	}
	.sidebar-details {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		overflow: auto;
		padding: 18px 12px;
	}
	:global(.control-templates-email-client-productivity-workspace.compose-button) {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		background: #5967c7;
		color: white;
		border-radius: var(--radius-lg);
		align-self: flex-start;
		min-height: 36px;
		padding: 7px 13px;
		font-size: 12px;
		font-weight: 600;
		box-shadow: 0 2px 4px #00000012;
	}
	.folder-navigation {
		margin-top: 23px;
	}
	.folder-navigation p {
		padding: 0 12px 7px;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 1.1px;
		color: var(--muted-foreground);
		font-weight: 600;
	}
	.folder-navigation a {
		padding-block: 8px;
		font-size: 12px;
	}
	.folder-navigation a.active {
		background: color-mix(in oklab, #5967c7 10%, transparent);
		color: var(--foreground);
		font-weight: 600;
	}
	.label-dot {
		width: 7px;
		height: 7px;
		margin-inline: 4px;
		border-radius: 50%;
		background: #9d82c7;
	}
	.tone-1 {
		background: #6b9dce;
	}
	.tone-2 {
		background: #ce9d7b;
	}
	.sidebar-footer {
		margin-top: auto;
		padding: 35px 12px 65px;
		color: var(--muted-foreground);
		font-size: 10px;
		line-height: 1.6;
	}
	.presence {
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #7ba48b;
		margin-right: 3px;
	}
	.workspace-main {
		display: grid;
		grid-template-rows: 64px minmax(0, 1fr);
		min-width: 0;
		min-height: 0;
	}
	.workspace-topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 0 28px;
		border-bottom: 1px solid var(--border);
	}
	.workspace-search {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--muted-foreground);
		width: min(420px, 100%);
	}
	.workspace-search :global(input.control-templates-email-client-productivity-workspace) {
		border: 0;
		outline: 0;
		background: transparent;
		width: 100%;
		padding: 10px 0;
		font-size: 12px;
		color: var(--foreground);
	}

	.topbar-right {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}
	.topbar-right {
		gap: 24px;
	}
	.workspace-date {
		font-size: 11px;
		color: var(--muted-foreground);
	}
	.account-name {
		font-size: 12px;
	}
	.account-avatar {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		font-size: 10px;
		background: #e5e8f3;
		color: #526099;
		font-weight: 600;
	}
	.account-email {
		display: block;
		max-width: 100%;
		overflow-wrap: anywhere;
		white-space: normal;
		font-size: 11px;
		font-weight: 400;
		color: var(--muted-foreground);
	}
	.workspace-content {
		position: relative;
		min-width: 0;
		min-height: 0;
		overflow: auto;
	}
	@media (max-width: 1100px) {
		.productivity-workspace {
			grid-template-columns: 185px minmax(0, 1fr);
		}
		.brand {
			padding-inline: 18px;
		}
		.workspace-topbar {
			padding-inline: 20px;
		}
		.workspace-date {
			display: none;
		}
	}
	@media (max-width: 767px) {
		.productivity-workspace {
			grid-template-columns: 1fr;
			grid-template-rows: 57px minmax(0, 1fr);
		}
		.workspace-sidebar {
			border-right: 0;
			border-bottom: 1px solid var(--border);
			flex-direction: row;
			align-items: center;
		}
		.brand {
			height: auto;
			padding: 0 12px;
			font-size: 0;
			gap: 0;
		}
		.brand-icon {
			width: 28px;
			height: 28px;
		}
		.app-navigation {
			display: flex;
			flex: 1;
			justify-content: space-around;
			border: 0;
			padding: 0 8px 0 0;
		}
		.app-navigation a {
			padding: 8px;
			gap: 6px;
			font-size: 12px;
		}
		.app-navigation small {
			display: none;
		}
		.sidebar-details {
			display: none;
		}
		.mobile-open .sidebar-details {
			display: flex;
			position: absolute;
			z-index: 30;
			top: 113px;
			left: 0;
			bottom: 0;
			width: 220px;
			background: var(--background);
			border-right: 1px solid var(--border);
			box-shadow: 8px 0 30px #0002;
		}
		.workspace-main {
			grid-template-rows: 56px minmax(0, 1fr);
		}
		.workspace-topbar {
			padding: 0 15px;
			gap: 14px;
		}
		.topbar-right {
			gap: 8px;
		}
		:global(.control-templates-email-client-productivity-workspace.compose-button) {
			min-height: 44px;
		}
		.account-name {
			display: none;
		}
		.workspace-search :global(input.control-templates-email-client-productivity-workspace) {
			font-size: 12px;
		}
	}
</style>
