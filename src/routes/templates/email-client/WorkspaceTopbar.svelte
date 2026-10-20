<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Input } from '#lib/bedrock/ui/input';

	import Search from '@lucide/svelte/icons/search';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Plus from '@lucide/svelte/icons/plus';
	import Inbox from '@lucide/svelte/icons/inbox';

	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';

	import { useWorkspace } from '#lib/templates/email-client/workspace.svelte.js';
	const workspace = useWorkspace();
	let {
		screen,
		mobileFolders = $bindable(),
		compose
	}: {
		screen: 'mail' | 'calendar' | 'tasks';
		mobileFolders: boolean;
		compose: () => Promise<void>;
	} = $props();
</script>

<header class="workspace-topbar">
	<IconButton
		type="button"
		icon={Inbox}
		label="Toggle mailboxes"
		class={['control-templates-email-client-productivity-workspace', 'mobile-folder-toggle']}
		onclick={() => (mobileFolders = !mobileFolders)}
		aria-expanded={mobileFolders}
	/>
	<label class="workspace-search"
		><Search size={17} /><Input
			class={['control-templates-email-client-productivity-workspace']}
			id="mail-search"
			aria-label={screen === 'mail'
				? 'Search mail'
				: screen === 'tasks'
					? 'Search tasks'
					: 'Search calendar'}
			placeholder={screen === 'mail'
				? 'Search your mail'
				: screen === 'tasks'
					? 'Search your tasks'
					: 'Search your calendar'}
			bind:value={workspace.query}
		/><kbd>/</kbd></label
	>
	<div class="topbar-right">
		<IconButton
			type="button"
			icon={Plus}
			label="Compose"
			class={['control-templates-email-client-productivity-workspace', 'mobile-compose']}
			onclick={compose}
		/>
		<span class="workspace-date">Mon, Sep 14</span><DropdownMenu.Root
			><DropdownMenu.Trigger
				>{#snippet child({ props })}<Button
						variant="ghost"
						type="button"
						{...props}
						class={[
							'control-templates-email-client-productivity-workspace h-auto whitespace-normal',
							'account-button'
						]}
						aria-label="Open account menu"
						><span class="account-avatar">AL</span><span class="account-name">Alex Lane</span
						><ChevronDown size={14} /></Button
					>{/snippet}</DropdownMenu.Trigger
			><DropdownMenu.Content align="end" class="w-64 max-w-[calc(100vw-2rem)]"
				><DropdownMenu.Label class="whitespace-normal"
					>Alex Lane<br /><span class="account-email">alex@lumenmail.example</span
					></DropdownMenu.Label
				><DropdownMenu.Separator /><DropdownMenu.Item
					onclick={() => {
						workspace.status = 'Notifications paused for this session.';
					}}>Pause notifications</DropdownMenu.Item
				><DropdownMenu.Item
					onclick={() => {
						workspace.query = '';
						workspace.status = 'Search cleared.';
					}}>Clear search</DropdownMenu.Item
				></DropdownMenu.Content
			></DropdownMenu.Root
		>
	</div>
</header>

<style>
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
	.workspace-search kbd {
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 0 5px;
		font-size: 11px;
	}
	.topbar-right,
	:global(.control-templates-email-client-productivity-workspace.account-button) {
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

	:global(.control-templates-email-client-productivity-workspace.mobile-compose) {
		display: none;
	}
	:global(.control-templates-email-client-productivity-workspace.mobile-folder-toggle) {
		display: none;
	}
	@media (max-width: 1100px) {
		.workspace-topbar {
			padding-inline: 20px;
		}
		.workspace-date {
			display: none;
		}
	}
	@media (max-width: 767px) {
		.workspace-topbar {
			padding: 0 15px;
			gap: 14px;
		}
		:global(.control-templates-email-client-productivity-workspace.mobile-compose) {
			display: grid;
			place-items: center;
			min-width: 44px;
			min-height: 44px;
		}
		.topbar-right {
			gap: 8px;
		}
		:global(.control-templates-email-client-productivity-workspace.mobile-folder-toggle) {
			display: block;
		}
		.account-name,
		:global(.control-templates-email-client-productivity-workspace.account-button) :global(svg),
		.workspace-search kbd {
			display: none;
		}
		:global(.control-templates-email-client-productivity-workspace.account-button) {
			gap: 0;
		}
		.workspace-search :global(input.control-templates-email-client-productivity-workspace) {
			font-size: 12px;
		}
	}
</style>
