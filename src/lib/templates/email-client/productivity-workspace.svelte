<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { tick, onMount } from 'svelte';
	let mounted = $state(false);
	let visited = $state<string[]>([]);
	onMount(() => {
		mounted = true;
	});
	const requestedScreen = $derived(mounted ? page.url.searchParams.get('screen') : null);
	import Mail from '@lucide/svelte/icons/mail';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import ListChecks from '@lucide/svelte/icons/list-checks';
	import { Button } from '#lib/bedrock/ui/button';
	import MailScreen from './email-client.svelte';
	import CalendarScreen from './calendar-screen.svelte';
	import TasksScreen from './tasks-screen.svelte';
	const screens = [
		{ id: 'mail', label: 'Mail', icon: Mail },
		{ id: 'calendar', label: 'Calendar', icon: CalendarDays },
		{ id: 'tasks', label: 'Tasks', icon: ListChecks }
	] as const;
	const screen = $derived(
		['calendar', 'tasks'].includes(requestedScreen ?? '') ? requestedScreen! : 'mail'
	);
	async function navigate(next: string) {
		const url = new URL(page.url.href);
		url.searchParams.set('screen', next);
		visited = [...new Set([...visited, screen, next])];
		await goto(url, { reset: false });
		await tick();
		document.querySelector<HTMLElement>(`[data-productivity-screen="${next}"] h1`)?.focus();
	}
</script>

<svelte:head
	><title
		>Lumen {screen === 'mail' ? 'Mail' : screen === 'calendar' ? 'Calendar' : 'Tasks'} — Productivity
		template</title
	></svelte:head
>
<div class="productivity-workspace">
	<nav
		aria-label="Productivity screens"
		class="flex items-center justify-between gap-3 border-b bg-muted/30 px-3 py-2 sm:px-6"
	>
		<div class="flex gap-1">
			{#each screens as item (item.id)}<Button
					href={`?screen=${item.id}`}
					variant={screen === item.id ? 'secondary' : 'ghost'}
					aria-current={screen === item.id ? 'page' : undefined}
					onclick={(event) => {
						event.preventDefault();
						void navigate(item.id);
					}}><item.icon class="size-4" />{item.label}</Button
				>{/each}
		</div>
		<span class="hidden text-xs text-muted-foreground md:block"
			>Your work, with room to breathe · Local demo</span
		>
	</nav>
	<div hidden={screen !== 'mail'} data-productivity-screen="mail" class="workspace-screen">
		<MailScreen active={screen === 'mail'} onNavigateCalendar={() => void navigate('calendar')} />
	</div>
	<div hidden={screen !== 'calendar'} data-productivity-screen="calendar" class="workspace-screen">
		{#if screen === 'calendar' || visited.includes('calendar')}<CalendarScreen
				active={screen === 'calendar'}
			/>{/if}
	</div>
	<div hidden={screen !== 'tasks'} data-productivity-screen="tasks" class="workspace-screen">
		{#if screen === 'tasks' || visited.includes('tasks')}<TasksScreen
				active={screen === 'tasks'}
			/>{/if}
	</div>
</div>

<style>
	.workspace-screen:not([hidden]) {
		animation: screen-enter var(--motion-state) var(--motion-ease-enter) both;
	}
	@keyframes screen-enter {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.workspace-screen:not([hidden]) {
			animation: none;
		}
	}
</style>
