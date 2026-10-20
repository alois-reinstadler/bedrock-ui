<script lang="ts">
	import { createMailCommands } from '#lib/templates/email-client/mail-commands.js';
	import WorkspaceSidebar from './WorkspaceSidebar.svelte';
	import WorkspaceTopbar from './WorkspaceTopbar.svelte';

	import { page } from '$app/state';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { goto, afterNavigate } from '$app/navigation';
	import type { Snippet } from 'svelte';

	import { useWorkspace, mailBase } from '#lib/templates/email-client/workspace.svelte.js';
	let { children }: { children: Snippet } = $props();
	const workspace = useWorkspace();
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
		try {
			if (localStorage.getItem('lumen-mail-density') === 'compact')
				workspace.mailDensity = 'compact';
		} catch {
			/* Storage can be unavailable in private previews. */
		}
	});
	let mobileFolders = $state(false);
	const screen = $derived(
		page.url.pathname.includes('/calendar')
			? 'calendar'
			: page.url.pathname.includes('/tasks')
				? 'tasks'
				: 'mail'
	);
	const activeFolder = $derived((page.params as { folder?: string }).folder ?? 'inbox');
	const label = $derived(browser && mounted ? page.url.searchParams.get('label') : null);

	afterNavigate(() => {
		mobileFolders = false;
		document.querySelector<HTMLElement>('.workspace-content h1')?.focus();
	});
	const commands = createMailCommands(
		workspace,
		() => undefined,
		(message) => {
			workspace.status = message;
		}
	);
	async function compose() {
		commands.openCompose();
		await goto(mailBase);
		document.getElementById('compose-to')?.focus();
	}
</script>

<svelte:head
	><title>Lumen {screen === 'mail' ? 'Mail' : screen === 'calendar' ? 'Calendar' : 'Tasks'}</title
	></svelte:head
>
<div class="productivity-workspace">
	<WorkspaceSidebar {screen} {activeFolder} {label} {mobileFolders} {compose} />
	<div class="workspace-main">
		<WorkspaceTopbar {screen} bind:mobileFolders {compose} />
		<main class="workspace-content" data-productivity-screen={screen}>{@render children()}</main>
	</div>
	<p class="sr-only" role="status">{workspace.status}</p>
</div>

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

	.workspace-main {
		display: grid;
		grid-template-rows: 64px minmax(0, 1fr);
		min-width: 0;
		min-height: 0;
	}

	.workspace-content {
		position: relative;
		min-width: 0;
		min-height: 0;
		overflow: auto;
	}
	:global(.workspace-content .workspace-page-heading) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border-bottom: 1px solid var(--border);
		padding: 22px 28px;
		height: 86px;
	}
	:global(.workspace-content .workspace-page-heading h1) {
		font-size: 20px;
		font-weight: 600;
		letter-spacing: -0.5px;
	}
	:global(.workspace-content .workspace-page-heading h1[tabindex='-1']) {
		outline: none;
	}
	:global(.workspace-content .workspace-page-heading p) {
		font-size: 11px;
		color: var(--muted-foreground);
		margin-top: 4px;
	}
	@media (max-width: 1100px) {
		.productivity-workspace {
			grid-template-columns: 185px minmax(0, 1fr);
		}
	}
	@media (max-width: 767px) {
		.productivity-workspace {
			grid-template-columns: 1fr;
			grid-template-rows: 57px minmax(0, 1fr);
		}

		.workspace-main {
			grid-template-rows: 56px minmax(0, 1fr);
		}

		:global(.workspace-content .workspace-page-heading) {
			padding: 18px;
			height: 78px;
		}
	}
</style>
