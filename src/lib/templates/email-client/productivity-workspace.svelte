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
	import { calendarEvents, workspaceTasks, demoToday } from './productivity-data.js';
	let events = $state(calendarEvents.map((event) => ({ ...event })));
	let tasks = $state(workspaceTasks.map((task) => ({ ...task })));
	let calendar: CalendarScreen | undefined = $state();
	let taskScreen: TasksScreen | undefined = $state();
	let workspaceStatus = $state('');
	async function createTask(subject: string, context: string) {
		const id = `mail-task-${Date.now()}`;
		tasks.push({
			id,
			title: subject,
			note: context,
			project: 'Mail follow-up',
			due: demoToday,
			completed: false
		});
		workspaceStatus = `Task created from ${subject}.`;
		await navigate('tasks');
		await taskScreen?.revealTask(id);
	}
	async function createEvent(subject: string, context: string) {
		await navigate('calendar');
		calendar?.composeEvent(subject, context);
	}
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
	<nav aria-label="Productivity screens" class="app-rail">
		<div class="app-links">
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
		<span class="workspace-brand" aria-label="Lumen workspace"
			>L<span class="sr-only">umen</span></span
		>
	</nav>
	<div hidden={screen !== 'mail'} data-productivity-screen="mail" class="workspace-screen">
		<MailScreen
			active={screen === 'mail'}
			onNavigateCalendar={() => void navigate('calendar')}
			onCreateTask={createTask}
			onCreateEvent={createEvent}
		/>
	</div>
	<div hidden={screen !== 'calendar'} data-productivity-screen="calendar" class="workspace-screen">
		{#if screen === 'calendar' || visited.includes('calendar')}<CalendarScreen
				active={screen === 'calendar'}
				bind:events
				bind:this={calendar}
			/>{/if}
	</div>
	<div hidden={screen !== 'tasks'} data-productivity-screen="tasks" class="workspace-screen">
		{#if screen === 'tasks' || visited.includes('tasks')}<TasksScreen
				active={screen === 'tasks'}
				bind:tasks
				bind:this={taskScreen}
			/>{/if}
	</div>
	<p role="status" class="sr-only">{workspaceStatus}</p>
</div>

<style>
	.productivity-workspace {
		display: grid;
		grid-template-columns: 5.5rem minmax(0, 1fr);
		min-width: 0;
		position: relative;
	}
	.app-rail {
		position: sticky;
		top: 3.5rem;
		align-self: start;
		height: calc(100svh - 3.5rem);
		grid-row: 1;
		grid-column: 1;
		background: var(--muted);
		border-right: 1px solid var(--border);
		padding: 1rem 0.25rem;
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-end;
		align-items: center;
		gap: 1.5rem;
	}
	.app-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}
	.app-links :global(a) {
		height: auto;
		min-height: 4rem;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.7rem;
		padding: 0.5rem 0.2rem;
	}
	.workspace-brand {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.8rem;
		background: var(--primary);
		color: var(--primary-foreground);
		font-weight: 700;
	}
	.workspace-screen {
		grid-column: 2;
		grid-row: 1;
		min-width: 0;
	}
	@media (max-width: 767px) {
		.app-rail {
			height: auto;
			z-index: 25;
		}
		.productivity-workspace {
			grid-template-columns: minmax(0, 1fr);
		}
		.app-rail {
			grid-column: 1;
			grid-row: 1;
			flex-direction: row;
			padding: 0.25rem 0.5rem;
			border-right: 0;
			border-bottom: 1px solid var(--border);
			gap: 0.5rem;
		}
		.app-links {
			flex-direction: row;
			justify-content: space-around;
		}
		.app-links :global(a) {
			flex-direction: row;
			min-height: 2.5rem;
			padding: 0.5rem;
			font-size: 0.8rem;
		}
		.workspace-brand {
			display: none;
		}
		.workspace-screen {
			grid-column: 1;
			grid-row: 2;
		}
	}

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
